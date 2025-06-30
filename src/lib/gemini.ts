import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Document } from "@langchain/core/documents";
import Bottleneck from "bottleneck";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const limiter = new Bottleneck({
  minTime: 4200, // 4.2 sec gap = ~14 requests/min (safely under 15)
  maxConcurrent: 1,
});

const limitedGenerate = limiter.wrap((prompt: string[]) =>
  model.generateContent(prompt),
);

export const aiSummarizeCommit = async (diff: string) => {
  const response = await limitedGenerate([
    `You are an expert programmer, and you are trying to summarize a git diff.
    Reminders about the git diff format:
    For every file, there are a few metadata lines, like (for example):
    \`\`\`
    diff --git a/lib/index.js b/lib/index.js
    index aadf691..bfef803 100644
    --- a/lib/index.js
    +++ b/lib/index.js
    \`\`\`
    This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
    Then there is a specifier of the lines that were modified.
    A line starting with \`+\` means it was added.
    A line that starting with \`-\` means that line was deleted.
    A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
    It is not part of the diff.
    
    [...]
    EXAMPLE SUMMARY COMMENTS:

    * Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts],[packages/server/recordings_api.ts] [packages/server/constants.ts]
    * Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
    * Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
    * Added an OpenAI API for completions [packages/utils/apis/openai.ts]
    * Lowered numeric tolerance for test files
    \`\`\`
    Most commits will have less comments than this examples list.
    The last comment does not include the file names.
    because there were more than two relevant files in the hypothetical commit.
    Do not include parts of the example in your summary.
    It is given only as an example of appropriate comments.`,
    `Please summarise the following diff file: \n\n${diff}`,
  ]);
  return response.response?.text() ?? "didn't work";
};

export const summarizeCode = async (doc: Document) => {
  console.log(`getting summary for ${doc.metadata.source}`);
  try {
    
  
  const code = doc.pageContent.slice(0, 10000);
  const response = await limitedGenerate([
    `You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects.
    You are onboarding a junior software engineer and explaining to them the purpose of ${doc.metadata.source} file.
    Here is the code:
    ---
    ${code}
    ---
    Give a summary no more than 100 words of the above`,
  ]);
  return response.response?.text() ?? "Couldn't summarize the code";
}catch (error) {
    console.error(`Error summarizing code for ${doc.metadata.source}:`, error);
    return "Error summarizing the code";
  }
};

export async function generateEmbedding(summary: string) {
  const model = genAI.getGenerativeModel({
    model: `text-embedding-004`,
  });
  const result = await model.embedContent(summary);
  const embedding = result.embedding;
  return embedding.values;
}
