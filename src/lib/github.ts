import { db } from "@/server/db"
import axios from "axios"
import { Octokit } from "octokit"
import { aiSummarizeCommit } from "./gemini"

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const githubUrl = "https://github.com/docker/genai-stack"

export type Response = {
  commitHash: string
  commitMessage: string
  commitAuthorName: string
  commitAuthorAvatar: string
  commitDate: Date
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
const [owner, repo] = githubUrl.split('/').slice(-2)

  if (!owner || !repo) {
    throw new Error(`Invalid GitHub URL: ${githubUrl}`)
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  })

  const sortedCommits = data
    .sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]

  return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit?.message ?? "",
    commitAuthorName: commit.commit?.author.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: new Date(commit.commit?.author?.date ?? ""),
  }))
}

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId)
  const commitHashes = await getCommitHashes(githubUrl)
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)

  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => summarizeCommit(githubUrl, commit.commitHash))
  )

  const summaries = summaryResponses.map((response) =>
    response.status === "fulfilled" ? response.value as string : ""
  )

  const commits = await Promise.all(
    summaries.map((summary, index) => {
      return db.commit.create({
        data: {
          projectId: projectId,
          commitHash: unprocessedCommits[index]!.commitHash,
          commitMessage: unprocessedCommits[index]!.commitMessage,
          commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
          commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
          commitDate: unprocessedCommits[index]!.commitDate,
          summary,
        },
      })
    })
  )

  return commits
}

async function summarizeCommit(githubUrl: string, commitHash: string) {
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  })

  if (!data || typeof data !== "string") {
    throw new Error(`No diff data found for commit: ${commitHash}`)
  }
  console.log("Generated summaries:")
  console.log(aiSummarizeCommit(data))

  return await aiSummarizeCommit(data)
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  })

  if (!project) {
    throw new Error("Project not found")
  }

  if (!project.githubUrl) {
    throw new Error("Project does not have a GitHub URL")
  }

  return { project, githubUrl: project.githubUrl }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
    select: { commitHash: true },
  })

  const processedHashes = new Set(processedCommits.map((c:any) => c.commitHash))

  return commitHashes.filter((commit) => !processedHashes.has(commit.commitHash))
}
