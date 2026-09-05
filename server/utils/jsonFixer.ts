/**
 * Helper to safely extract and parse JSON from Gemini text responses.
 */
export function safeJsonParse<T>(rawText: string | undefined | null, fallback: T): T {
  if (!rawText) return fallback;

  try {
    let clean = rawText.trim();
    // Strip markdown code fence if present
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    }

    // Try direct parse
    return JSON.parse(clean) as T;
  } catch (err) {
    console.warn('Failed to parse Gemini JSON output directly. Attempting regex extraction...', err);
    try {
      // Find first '{' or '[' and last '}' or ']'
      const firstBrace = rawText.indexOf('{');
      const firstBracket = rawText.indexOf('[');

      let start = -1;
      let end = -1;

      if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        start = firstBrace;
        end = rawText.lastIndexOf('}');
      } else if (firstBracket !== -1) {
        start = firstBracket;
        end = rawText.lastIndexOf(']');
      }

      if (start !== -1 && end !== -1 && end > start) {
        const jsonSub = rawText.substring(start, end + 1);
        return JSON.parse(jsonSub) as T;
      }
    } catch (nestedErr) {
      console.error('Regex extraction failed as well:', nestedErr);
    }
  }

  return fallback;
}
