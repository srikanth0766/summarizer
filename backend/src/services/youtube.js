import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";

export function extractVideoId(url) {
  const match = url.match(/(?:v=|\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export async function getTranscript(videoId) {
  const items = await YoutubeTranscript.fetchTranscript(videoId);
  const text = items.map(i => i.text).join(" ");
  return text;
}

export async function getVideoTitle(videoId) {
  try {
    const { data } = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    return data.title;
  } catch {
    return "";
  }
}
