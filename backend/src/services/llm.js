import OpenAI from "openai";
import { chunkText } from "./chunk.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeChunk(chunk) {
  const prompt = `
Summarize the following YouTube transcript into 4–6 bullet points in JSON:
{"bullet_points": ["..."]}

Text:
${chunk}
`;
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });
  try {
    return JSON.parse(response.output_text).bullet_points;
  } catch {
    return [response.output_text];
  }
}

async function combineSummaries(allBullets) {
  const prompt = `
Combine the following bullet points into one final JSON summary:
{
  "summary": "3-5 sentence overview",
  "bullet_points": ["...", "..."]
}

Bullet points:
${allBullets.join("\n")}
`;
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });
  try {
    return JSON.parse(response.output_text);
  } catch {
    return { summary: response.output_text, bullet_points: allBullets };
  }
}

export async function summarizeTranscript(transcript) {
  const chunks = chunkText(transcript);
  const allBullets = [];
  for (const chunk of chunks) {
    const bullets = await summarizeChunk(chunk);
    allBullets.push(...bullets);
  }
  const final = await combineSummaries(allBullets);
  return { summary: final.summary, bulletPoints: final.bullet_points };
}
