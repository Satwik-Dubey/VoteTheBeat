import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { io } from "../server";

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

// Delete a song
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // First get the song to know which session it belongs to
    const song = await prisma.song.findUnique({
      where: { id },
    });

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Delete the song
    await prisma.song.delete({
      where: { id },
    });

    // Emit socket event to notify other users
    io.to(`session:${song.sessionId}`).emit("song-removed", { songId: id });

    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ error: "Failed to delete song" });
  }
});

export default router;