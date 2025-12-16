import { Router } from "express";
import prisma from "../prisma";
import { io } from "../server";

const router = Router();

// Remove a song

// Delete /songs/:songId

router.delete("/:songId", async (req, res) => {
  const { songId } = req.params;
  const { userId } = req.body;

  // Validate input
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  // Find song
  const song = await prisma.song.findUnique({
    where: { id: songId },
  });

  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  // Only the user who added the song can remove it
  if (song.addedBy !== userId) {
    return res.status(403).json({
      message: "You can only remove songs added by you",
    });
  }
  // hamlog Notify karenge all users ko  before deletion
    io.to(`session:${song.sessionId}`).emit("song-removed", {
    songId: song.id,
    });

  // Delete song
  await prisma.song.delete({
    where: { id: songId },
  });


  res.json({ message: "Song removed successfully" });
});

export default router;