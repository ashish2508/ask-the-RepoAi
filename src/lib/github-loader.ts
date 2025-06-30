import { db } from "@/server/db";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { generateEmbedding, summarizeCode } from "./gemini";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || process.env.GITHUB_TOKEN,
    branch: "main",
    ignoreFiles: [
      ".gitignore",
      "README.md",
      "LICENSE",
      "CONTRIBUTING.md",
      "CODE_OF_CONDUCT.md",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lock",
      "bun.lockb",
    ],
    ignorePaths: [
      "node_modules",
      "dist",
      "build",
      "out",
      "coverage",
      ".next",
      ".nuxt",
      ".vercel",
      ".output",
      ".cache",
      ".vscode",
      ".idea",
      ".git",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  const docs = await loader.load();
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  const allEmbeddings = await generateEmbeddings(docs);
  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      if (!embedding) return;

      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summary,
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName,
          projectId,
        },
      });
      try {
        await db.$executeRaw`
          UPDATE "SourceCodeEmbedding"
          SET "summaryEmbedding" = ${embedding.embedding}::vector
          WHERE id = ${sourceCodeEmbedding.id};
        `;
      } catch (err) {
        console.error("Vector insert failed for", embedding.fileName, err);
      }
    }),
  );
  return docs;
};

const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      const summary = await summarizeCode(doc);
      const embedding = await generateEmbedding(summary);
      if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
        return null;
      }
      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
      };
    }),
  );
};
