import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import summarizeRoute from "./routes/summarize.js";
import historyRoute from "./routes/history.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));

app.get("/", (req, res) => res.send("✅ YouTube Summarizer API running"));
app.use("/api/summarize", summarizeRoute);
app.use("/api/history", historyRoute);

connectDB().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on port ${process.env.PORT}`)
  );
});
