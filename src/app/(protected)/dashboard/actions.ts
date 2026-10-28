
"use server";

import { generateEmbedding, streamCompletion } from "@/lib/ai";
import { indexGithubRepo } from "@/lib/github-loader";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { getDatabaseUserId } from "@/server/auth";
import { createStreamableValue } from "ai/rsc";

type RetrievedDocument = {
  fileName: string;
  sourceCode: string;
  summary: string;
  similarity: number;
};

const MAX_CONTEXT_CHARS = 8_000;
const MAX_FILE_CHARS = 1_500;

export async function askQuestion(
  question: string,
  projectId: string,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to ask a question.");
  }

  const trimmedQuestion = question.trim();

  if (!trimmedQuestion || trimmedQuestion.length > 4_000) {
    throw new Error("Enter a question under 4,000 characters.");
  }

  const dbUserId = await getDatabaseUserId(userId);

  const membership = await db.userToProject.findFirst({
    where: {
      projectId,
      userId: dbUserId,
    },
    select: { id: true },
  });

  if (!membership) {
    throw new Error("You do not have access to this repository.");
  }

  const stream = createStreamableValue();

  let result: RetrievedDocument[];

  try {
    const queryVector = await generateEmbedding(trimmedQuestion);
    const vectorQuery = `[${queryVector.join(",")}]`;

    result = await db.$queryRaw<RetrievedDocument[]>`
      SELECT
        "fileName",
        "sourceCode",
        "summary",
        1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
      FROM "SourceCodeEmbedding"
      WHERE
        "projectId" = ${projectId}
        AND "summaryEmbedding" IS NOT NULL
      ORDER BY "summaryEmbedding" <=> ${vectorQuery}::vector
      LIMIT 10;
    `;

    console.log(
      "Retrieved repository context:",
      result.map(({ fileName, similarity }) => ({
        fileName,
        similarity: Number(similarity),
      })),
    );
  } catch (error) {
    console.error("Could not retrieve repository context:", error);

    stream.update(
      "I couldn't retrieve repository context. Check the server logs for an embedding or database error, then try again.",
    );
    stream.done();

    return {
      output: stream.value,
      filesReferenced: [],
    };
  }

  if (result.length === 0) {
    stream.update(
      "No indexed repository files were found. Refresh the repository index and try again.",
    );
    stream.done();

    return {
      output: stream.value,
      filesReferenced: [],
    };
  }

  let context = "";

  for (const doc of result) {
    const entry =
      `Source: ${doc.fileName}\n` +
      `Summary: ${doc.summary}\n` +
      `Code:\n${doc.sourceCode.slice(0, MAX_FILE_CHARS)}\n\n`;

    if (context.length + entry.length > MAX_CONTEXT_CHARS) {
      const remaining = MAX_CONTEXT_CHARS - context.length;

      if (remaining > 0) {
        context += entry.slice(0, remaining);
      }

      break;
    }

    context += entry;
  }

  const prompt = `You are a codebase assistant.

Answer using only the repository context below. Explain relevant code clearly using Markdown. Do not invent details. If the context is insufficient, say so.

Repository context:
${context}

Question: ${trimmedQuestion}`;

  void (async () => {
    try {
      await streamCompletion(prompt, (delta) => {
        stream.update(delta);
      });
    } catch (error) {
      console.error("Question answering failed:", error);

      stream.update(
        "\n\nI couldn't complete the answer because the AI provider request failed. Check the server logs for details and try again.",
      );
    } finally {
      stream.done();
    }
  })();

  return {
    output: stream.value,
    filesReferenced: result,
  };
}

export async function reindexRepository(projectId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to re-index a repository.");
  }

  const dbUserId = await getDatabaseUserId(userId);

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      deletedAt: null,
      userToProjects: {
        some: { userId: dbUserId },
      },
    },
    select: {
      githubUrl: true,
    },
  });

  if (!project?.githubUrl) {
    throw new Error("Repository not found or unavailable.");
  }

  await indexGithubRepo(projectId, project.githubUrl);
}
