import express from "express";
import sessionRoutes from "./routes/session.routes";
import voteRoutes from "./routes/vote.routes";
import sessionSongsRoutes from "./routes/sessionSongs.routes";
import songRoutes from "./routes/song.routes";



const app = express();
app.use(express.json());


// Session APIs
//Any request starting with /sessions is handled by session.routes.ts
app.use("/sessions", sessionRoutes);
// Vote APIs
app.use("/songs", voteRoutes);
// Add song api
app.use("/sessions", sessionSongsRoutes);
// Delete
app.use("/songs", songRoutes);



export default app;

