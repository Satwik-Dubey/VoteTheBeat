import express from "express";
import cors from "cors";
import sessionRoutes from "./routes/session.routes";
import voteRoutes from "./routes/vote.routes";
import sessionSongsRoutes from "./routes/sessionSongs.routes";
import songRoutes from "./routes/song.routes";

const app = express();

// CORS MUST be first
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// Then JSON parser
app.use(express.json());

// Then routes
app.use("/sessions", sessionRoutes);
app.use("/songs", voteRoutes);
app.use("/sessions", sessionSongsRoutes);
app.use("/songs", songRoutes);

export default app;