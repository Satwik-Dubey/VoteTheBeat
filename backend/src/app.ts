import express from "express";
import sessionRoutes from "./routes/session.routes";

const app = express();
app.use(express.json());


// Session APIs
//Any request starting with /sessions is handled by session.routes.ts
app.use("/sessions", sessionRoutes);

export default app;

