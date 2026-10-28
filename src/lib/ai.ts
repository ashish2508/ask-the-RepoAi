
import Bottleneck from "bottleneck";

const CHAT_MODEL = "qwen/qwen3.8-27b";
const EMBEDDING_MODEL = "nvidia/nemotron-3.5-embed-1b:free";
const EMBEDDING_DIMENSIONS = 768;
const MAX_RETRIES = 2;
const MAX_CHAT_INPUT_CHARS = 12_000;
const MAX_CHAT_OUTPUT_TOKENS = 1_200;

const limiter = new Bottleneck({
  minTime: 1200,
  maxConcurrent: 1,
});

function openRouterApiKey() {
  const key = process.env.OPENROUTER_API_KEY;

  if (!key) {
    throw new Error("Set OPENROUTER_API_KEY to use OpenRouter embeddings.");
  }

  return key;
}

function groqApiKey() {
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    throw new Error("Set GROQ_API_KEY to use GroqCloud.");
  }

  return key;
}

async function groqRequest(body: unknown): Promise<Response> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Groq request failed (${response.status}): ${await response.text()}`,
    );
  }

  return response;
}

async function openRouterRequest(
  path: string,
  body: unknown,
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        `https://openrouter.ai/api/v1/${path}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterApiKey()}`,
            "Content-Type": "application/json",
            "X-Title": "Ask the RepoAI",
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        return response;
      }

      const detail = await response.text();
      const error = new Error(
        `OpenRouter request failed (${response.status}): ${detail}`,
      );

      if (response.status < 500 || attempt === MAX_RETRIES) {
        throw error;
      }

      lastError = error;
    } catch (error) {
      lastError = error;

      if (
        error instanceof Error &&
        /OpenRouter request failed \(\d+\)/.test(error.message)
      ) {
        throw error;
      }
    }

    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * 2 ** attempt),
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("OpenRouter request failed after retries.");
}

async function complete(prompt: string): Promise<string> {
  return limiter.schedule(async () => {
    const response = await groqRequest({
      model: CHAT_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: MAX_CHAT_OUTPUT_TOKENS,
    });

    const result = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };

    return result.choices?.[0]?.message?.content?.trim() ?? "";
  });
}

export async function streamCompletion(
  prompt: string,
  onToken: (token: string) => void,
): Promise<void> {
  await limiter.schedule(async () => {
    const response = await groqRequest({
      model: CHAT_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: MAX_CHAT_OUTPUT_TOKENS,
      stream: true,
    });

    if (!response.body) {
      throw new Error("Groq returned an empty stream.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      buffer += decoder.decode(value, { stream: !done });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const data = event
          .split("\n")
          .find((line) => line.startsWith("data: "))
          ?.slice(6);

        if (!data || data === "[DONE]") {
          continue;
        }

        const chunk = JSON.parse(data) as {
          choices?: { delta?: { content?: string | null } }[];
        };

        const token = chunk.choices?.[0]?.delta?.content;

        if (token) {
          onToken(token);
        }
      }

      if (done) {
        break;
      }
    }
  });
}

export const aiSummarizeCommit = async (
  diff: string,
): Promise<string> => {
  try {
    return await complete(
      `You are an expert programmer summarizing a git diff. Explain only meaningful changes in concise bullet points. Include relevant file paths in square brackets. Do not repeat example text or invent changes.

Git diff:
${diff.slice(0, MAX_CHAT_INPUT_CHARS)}`,
    );
  } catch (error) {
    console.error("Could not summarize commit:", error);
    return "Commit summary unavailable";
  }
};

export const summarizeCode = async (doc: {
  pageContent: string;
  metadata: Record<string, unknown>;
}): Promise<string> => {
  const source = String(doc.metadata.source ?? "this file");

  try {
    return await complete(
      `You are a senior software engineer onboarding a junior engineer. Explain the purpose and important behavior of ${source} in no more than 100 words. Base the explanation only on this code.

${doc.pageContent.slice(0, 10_000)}`,
    );
  } catch (error) {
    console.error(`Error summarizing code for ${source}:`, error);
    return `Summary unavailable for ${source}`;
  }
};

export async function generateEmbedding(
  input: string,
): Promise<number[]> {
  return limiter.schedule(async () => {
    const response = await openRouterRequest("embeddings", {
      model: EMBEDDING_MODEL,
      input,
    });

    const result = (await response.json()) as {
      data?: { embedding?: number[] }[];
    };

    const embedding = result.data?.[0]?.embedding;

    if (!embedding || embedding.length < EMBEDDING_DIMENSIONS) {
      throw new Error(
        `The embedding model returned fewer than ${EMBEDDING_DIMENSIONS} values.`,
      );
    }

    return embedding.slice(0, EMBEDDING_DIMENSIONS);
  });
}

export async function generateEmbeddingBatch(
  inputs: string[],
): Promise<number[][]> {
  if (inputs.length === 0) {
    return [];
  }

  const batchSize = 16;
  const embeddings: number[][] = [];

  for (let start = 0; start < inputs.length; start += batchSize) {
    const batch = inputs.slice(start, start + batchSize);

    const result = await limiter.schedule(async () => {
      const response = await openRouterRequest("embeddings", {
        model: EMBEDDING_MODEL,
        input: batch,
      });

      const data = (await response.json()) as {
        data?: {
          index?: number;
          embedding?: number[];
        }[];
      };

      if (!data.data || data.data.length !== batch.length) {
        throw new Error(
          `Expected ${batch.length} embeddings, received ${data.data?.length ?? 0}.`,
        );
      }

      const ordered = [...data.data].sort(
        (a, b) => (a.index ?? 0) - (b.index ?? 0),
      );

      return ordered.map((item) => {
        if (
          !item.embedding ||
          item.embedding.length < EMBEDDING_DIMENSIONS
        ) {
          throw new Error(
            `The embedding model returned fewer than ${EMBEDDING_DIMENSIONS} values.`,
          );
        }

        return item.embedding.slice(0, EMBEDDING_DIMENSIONS);
      });
    });

    embeddings.push(...result);
  }

  return embeddings;
}
