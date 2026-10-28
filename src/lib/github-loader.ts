
import { db } from "@/server/db";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { generateEmbeddingBatch } from "./ai";

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

  return loader.load();
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);

  if (docs.length === 0) {
    throw new Error("No source files were found in this repository.");
  }

  const inputs = docs.map((doc) => {
    const fileName = String(doc.metadata.source ?? "unknown");
    return `File: ${fileName}\n\n${doc.pageContent.slice(0, 10_000)}`;
  });

  const embeddings = await generateEmbeddingBatch(inputs);

  if (embeddings.length !== docs.length) {
    throw new Error("Not all repository files received embeddings.");
  }

  const records = docs.map((doc, index) => {
    const embedding = embeddings[index];

    if (!embedding) {
      throw new Error(`Missing embedding for file at index ${index}.`);
    }

    const fileName = String(doc.metadata.source ?? "unknown");

    return {
      fileName,
      sourceCode: doc.pageContent,
      summary: `Source file: ${fileName}`,
      embedding,
    };
  });

  await db.$transaction(
    async (tx) => {
      await tx.sourceCodeEmbedding.deleteMany({
        where: { projectId },
      });

      for (const record of records) {
        const created = await tx.sourceCodeEmbedding.create({
          data: {
            projectId,
            fileName: record.fileName,
            sourceCode: record.sourceCode,
            summary: record.summary,
          },
        });

        const vector = `[${record.embedding.join(",")}]`;

        await tx.$executeRaw`
          UPDATE "SourceCodeEmbedding"
          SET "summaryEmbedding" = ${vector}::vector
          WHERE "id" = ${created.id};
        `;
      }
    },
    {
      maxWait: 10_000,
      timeout: 60_000,
    },
  );

  return docs;
};
