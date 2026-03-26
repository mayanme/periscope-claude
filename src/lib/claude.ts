import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY environment variable is not set");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const CLAUDE_MODEL = "claude-sonnet-4-6";

export function extractJson(text: string): unknown {
  const cleaned = text.trim();

  // 1. Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {}

  // 2. Try extracting from code fence (with or without closing fence)
  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]+?)(?:```|$)/);
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {}
  }

  // 3. Try extracting first {...} block (greedy — handles no closing fence)
  const braced = cleaned.match(/\{[\s\S]+\}/);
  if (braced) {
    try {
      return JSON.parse(braced[0]);
    } catch {}
  }

  // 4. Response was likely truncated mid-JSON — throw with context
  throw new Error(`Could not parse JSON from Claude response: ${cleaned.slice(0, 200)}`);
}
