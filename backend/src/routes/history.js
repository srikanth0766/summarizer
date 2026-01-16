import express from "express";
import VideoSummary from "../models/VideoSummary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await VideoSummary.find().sort({ createdAt: -1 }).limit(20);
  res.json(data);
});

export default router;
