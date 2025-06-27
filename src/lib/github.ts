import { db } from "@/server/db";
import axios from "axios";
import { Octokit } from "octokit";
import { aiSummarizeCommit } from "./gemini";
//1:57:32
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
  const urlParts = githubUrl.replace(/\.git$/, '').split('/');
  const owner = urlParts[urlParts.length - 2];
  const repo = urlParts[urlParts.length - 1];  
  
    
  if (!owner || !repo) {
    throw new Error(`Invalid GitHub URL: ${githubUrl}`);
  }
  
  console.log(`Attempting to access: ${owner}/${repo}`);
  
  
  const {data} = await octokit.rest.repos.listCommits({
    owner,
    repo,
})

const sortedCommits = data.sort((a: any, b:any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]
return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit?.message ?? "",
    commitAuthorName: commit.commit?.author.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: new Date(commit.commit?.author?.date ?? ""),
  }))
}

export const pollCommits= async (projectId: string) => {
  const {project, githubUrl} = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
  const summaryResponses =await Promise.allSettled(unprocessedCommits.map(commit=>{
    return summarizeCommit(githubUrl, commit.commitHash)
  }))
  const summaries = summaryResponses.map((response) => {
    if (response.status === 'fulfilled') {
      return response.value as string;
    } 
    return ""
  })
  
  const commits = db.commit.createMany({
    data: summaries.map((summary, index) => {
      return {
        projectId: projectId,
        commitHash: unprocessedCommits[index]!.commitHash, 
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary,
      }
    })
  })
  return commits;
}

async function summarizeCommit(githubUrl: string, commitHash: string) {
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: 'application/vnd.github.v3.diff',
    },
  });
  if (!data || !data.commit || !data.commit.message) {
    throw new Error(`No commit message found for commit hash: ${commitHash}`);
  }
  return await aiSummarizeCommit(data);
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
    !processedCommits.some((processedCommit:any ) => processedCommit.commitHash === commit.commitHash));
  return UnProcessedCommitHashes;
}
