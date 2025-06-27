import { db } from "@/server/db"
import { Octokit } from "octokit"

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,   
})

const githubUrl = "https://github.com/docker/genai-stack"

export type Response = {
  commitHash: string
  commitMessages: string
  commitAuthorName: string
  commitAuthorAvatar: string
  commitDate: Date
}
export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
const {data} = await octokit.rest.repos.listCommits({
  owner: "docker",
  repo: "genai-stack",
  
})

const sortedCommits = data.sort((a: any, b:any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]
return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessages: commit.commit?.message ?? "",
    commitAuthorName: commit.commit?.author.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: new Date(commit.commit?.author?.date ?? ""),
  }))
}

export const pullCommits= async (projectId: string): Promise<Response[]> => {
  const {project, githubUrl} = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  })
  if (!project ) {
    throw new Error("Project not found");
  }
  if (!project.githubUrl) {
    throw new Error("Project does not have a GitHub URL");
  }
  return {project, githubUrl: project?.githubUrl!};
}

async function filterUnprocessedCommits(projectId:string, commitHashes: Response[] ) {
  
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  })
  const UnProcessedCommitHashes = commitHashes.filter((commit) => 
    !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash));
  return UnProcessedCommitHashes;
}
