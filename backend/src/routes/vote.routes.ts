import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { io } from "../server";

const router = Router();
const prisma = new PrismaClient();


 // Vote for a song

router.post("/:songId/vote", async (req, res) => {
  const { songId } = req.params;
  const { userId } = req.body;

  // Validate input
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    // Find the song
    const song = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Rule 2: User cannot vote twice
    const existingVote = await prisma.vote.findFirst({
      where: {
        songId,
        userId, // Changed from odUserId to userId
      },
    });

    if (existingVote) {
      return res.status(400).json({
        message: "You already voted for this song",
      });
    }

    // Create vote entry (unique constraint prevents double voting)
    await prisma.vote.create({
      data: {
        songId,
        userId, 
      },
    });

    // Increment vote count
    const updatedSong = await prisma.song.update({
      where: { id: songId },
      data: {
        votes: { increment: 1 },
      },
    });
    // Notify all users in this session about vote update
    io.to(`session:${updatedSong.sessionId}`).emit("song-voted", updatedSong);

    res.json(updatedSong);
  } catch (error) {
    console.error("Error voting for song:", error);
    res.status(500).json({ message: "Failed to vote for song" });
  }
});

export default router;
