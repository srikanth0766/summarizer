import express from "express";
import VideoSummary from "../models/VideoSummary.js";
import { extractVideoId, getTranscript, getVideoTitle } from "../services/youtube.js";
import { summarizeTranscript } from "../services/llm.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = extractVideoId(url);
    if (!videoId) return res.status(400).json({ error: "Invalid YouTube URL" });

    let existing = await VideoSummary.findOne({ videoId });
    if (existing) return res.json(existing);

    const transcript = await getTranscript(videoId);
    const title = await getVideoTitle(videoId);
    const { summary, bulletPoints } = await summarizeTranscript(transcript);

    const doc = await VideoSummary.create({
      videoId,
      url,
      title,
      summary,
      bulletPoints,
      rawTranscript: transcript,
    });

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error summarizing video" });
  }
});

export default router;
