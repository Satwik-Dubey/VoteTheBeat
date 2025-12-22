import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Create a session
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Session name is required" });
  }

  try {
    const session = await prisma.session.create({
      data: { name },
    });

    res.json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ 
      message: "Failed to create session", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

// Get all sessions (PUT THIS BEFORE /:sessionId to avoid conflicts)
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

// Get session details by ID
router.get("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        songs: true,
      },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ message: "Failed to fetch session" });
  }
});

export default router;