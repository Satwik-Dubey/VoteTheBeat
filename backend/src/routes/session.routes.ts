import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// Create a session
router.post("/", async (req, res) => {
  console.log("POST /sessions called with body:", req.body);
  
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Session name is required" });
  }

  try {
    const session = await prisma.session.create({
      data: { name },
    });

    console.log("Session created successfully:", session);
    res.json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ 
      message: "Failed to create session", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

// Get all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: { songs: true },
    });
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

export default router;