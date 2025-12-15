import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// Create a session
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Session name is required" });
  }

  const session = await prisma.session.create({
    data: { name },
  });

  res.json(session);
});

// Get all sessions
router.get("/", async (req, res) => {
  const sessions = await prisma.session.findMany({
    include: { songs: true },
  });

  res.json(sessions);
});

export default router;
