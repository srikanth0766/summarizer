import mongoose from "mongoose";

const VideoSummarySchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  title: String,
  summary: String,
  bulletPoints: [String],
  rawTranscript: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("VideoSummary", VideoSummarySchema);
