"use server";

import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY as string,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;
  const result = (await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10;
    `) as { fileName: string; sourceCode: string; summary: string }[];

    let context = "";
    for (const doc of result) {
      context+=`source:${doc.fileName}\ncode content:${doc.sourceCode}\nsummary of file:${doc.summary}\n\n`;
    }
    
  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
        You are an AI code assistant designed to answer questions about the codebase, tailored for a technical intern learning about the codebase. Your goal is to provide clear, accurate, and detailed responses to support their learning journey.

        **About the AI Assistant:**
        - The AI assistant is a powerful, human-like artificial intelligence built to assist with technical queries.
        - The AI possesses expert knowledge, is highly helpful, clever, and articulate in its responses.
        - The AI maintains a professional, well-mannered, and approachable demeanor.
        - The AI is always friendly, kind, and inspiring, delivering vivid, thoughtful, and precise answers to engage and educate the user.
        - The AI has comprehensive knowledge across various topics and can accurately address nearly any question, with a focus on codebase-related inquiries.
        - When responding to questions about code or specific files, the AI provides detailed, step-by-step instructions to ensure clarity and understanding for the intern.

        **START CONTEXT BLOCK**  
        ${context}  
        **END OF CONTEXT BLOCK**

        **START QUESTION**  
        ${question}  
        **END OF QUESTION**

        **Response Guidelines:**
        - The AI assistant will incorporate any provided **CONTEXT BLOCK** to inform its responses.
        - If the context does not contain the necessary information to answer the question, the AI will respond: "I'm sorry, but the provided context does not contain enough information to answer your question."
        - The AI will not apologize for previous responses but will acknowledge new information if applicable, e.g., "Based on the provided context, here is the updated information."
        - The AI will strictly adhere to the information in the context and will not invent or assume details not explicitly provided.
        - Responses will be formatted in markdown syntax for clarity, including code snippets where relevant.
        - Answers will be detailed, unambiguous, and tailored to the technical intern's level of understanding, ensuring they are educational and easy to follow.
        `,
    });
    for await (const delta of textStream) {
      stream.update(delta)
    }

    stream.done();
  })()

  return {
    output: stream.value,
    filesReferenced: result,
  };
}
