import { Router } from "express";
import prisma from "../prisma";
import { io } from "../server";

const router = Router();

/**
 * Vote for a song
 * POST /songs/:songId/vote
 */
router.post("/:songId/vote", async (req, res) => {
  const { songId } = req.params;
  const { userId } = req.body;

  // Validate input
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  // Find the song
  const song = await prisma.song.findUnique({
    where: { id: songId },
  });

  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  // Rule 1: User cannot vote on own song
  if (song.addedBy === userId) {
    return res.status(403).json({
      message: "You can't vote on your own song",
    });
  }

  try {
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
    // Rule 2: User cannot vote twice
    return res.status(409).json({
      message: "You have already voted for this song",
    });
  }
});

export default router;
