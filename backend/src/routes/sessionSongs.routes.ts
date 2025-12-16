import { Router } from "express";
import prisma from "../prisma";
import { io } from "../server";

const router = Router();

/**
 * Add a song to a session
 * POST /sessions/:sessionId/songs
 */
router.post("/:sessionId/songs", async (req, res) => {
  const { sessionId } = req.params;
  const { trackId, title, artist, imageUrl, addedBy } = req.body;

  // Basic validation
  if (!trackId || !title || !artist || !addedBy) {
    return res.status(400).json({
      message: "trackId, title, artist and addedBy are required",
    });
  }

  // Check if session exists
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  try {
    // Create song (unique constraint prevents duplicates per session)
    const song = await prisma.song.create({
      data: {
        trackId,
        title,
        artist,
        imageUrl,
        addedBy,
        sessionId,
      },
    });
    // Notify all users in this session
    io.to(`session:${sessionId}`).emit("song-added", song);

    res.status(201).json(song);
  } catch (error) {
    // Duplicate song in same session
    return res.status(409).json({
      message: "This song is already added to the session",
    });
  }
});

// Get songs

router.get("/:sessionId/songs", async(req,res)=>{
    const {sessionId}=req.params;

    //Check if session exists
    const session= await prisma.session.findUnique({
        where :{id:sessionId},
    });

    if(!session){
        res.status(404).json({message:"Session Not Found"});
    }

    //Fetch songs
    const songs=await prisma.song.findMany({
        where:{sessionId},
        orderBy:{votes:"desc"},
    });

    res.json(songs);
})

export default router;
