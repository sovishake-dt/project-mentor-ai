import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in environment variable.');
    }

    aiInstance = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return aiInstance;
}

export const MODEL_FLASH = 'gemini-3.8-flash';
export const MODEL_FALLBACK = 'gemini-2.5-flash';

type GenerateOptions = {
  responseMimeType?: string;
  temperature?: number;
  maxOutputTokens?: number;
};

function getErrorStatus(error: any): number | undefined {
  return (
    error?.status ??
    error?.error?.code ??
    error?.response?.status
  );
}

function isRetryableError(error: any): boolean {
  const status = getErrorStatus(error);

  return (
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      const error: any = new Error(
        `Gemini request timed out after ${timeoutMs}ms`
      );

      error.status = 504;

      reject(error);
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function generateWithGemini(
  prompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  const ai = getGeminiClient();

  const models = [
    MODEL_FLASH,
    MODEL_FALLBACK,
  ];

  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(
          `Gemini request: model=${model}, attempt=${attempt}`
        );

        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              ...(options.responseMimeType
                ? {
                    responseMimeType: options.responseMimeType,
                  }
                : {}),
              temperature: options.temperature ?? 0.7,
              maxOutputTokens:
                options.maxOutputTokens ?? 4096,
            },
          }),
          15000
        );

        const text = response.text;

        if (!text) {
          throw new Error('Gemini returned an empty response.');
        }

        console.log(
          `Gemini success: model=${model}, attempt=${attempt}`
        );

        return text;
      } catch (error: any) {
        lastError = error;

        const status = getErrorStatus(error);

        const message =
          error?.message ||
          error?.error?.message ||
          'Unknown Gemini error';

        console.error(
          `Gemini error: model=${model}, attempt=${attempt}, status=${status}: ${message}`
        );

        if (!isRetryableError(error)) {
          throw error;
        }

        if (attempt < 2) {
          const delay = status === 429 ? 3000 : 1500;

          console.log(
            `Retrying Gemini request in ${delay}ms...`
          );

          await sleep(delay);
        }
      }
    }

    console.warn(
      `Gemini model ${model} failed. Trying fallback model if available.`
    );
  }

  throw lastError || new Error('Gemini request failed.');
}