import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { Song } from "../services/api";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

interface UseSocketProps {
  sessionId: string | undefined;
  onSongAdded: (song: Song) => void;
  onSongVoted: (song: Song) => void;
  onSongRemoved: (data: { songId: string }) => void;
}

export function useSocket({ sessionId, onSongAdded, onSongVoted, onSongRemoved }: UseSocketProps) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    // Initialize socket connection
    console.log("🔌 Connecting to WebSocket...");
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket.id);
      // Join the session room
      socket.emit("join-session", sessionId);
      console.log(`🚪 Joined session room: ${sessionId}`);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 WebSocket disconnected:", reason);
    });

    // Listen for real-time events
    socket.on("song-added", (song: Song) => {
      console.log("🎵 Song added event received:", song);
      onSongAdded(song);
    });

    socket.on("song-voted", (song: Song) => {
      console.log("👍 Song voted event received:", song);
      onSongVoted(song);
    });

    socket.on("song-removed", (data: { songId: string }) => {
      console.log("🗑️ Song removed event received:", data);
      onSongRemoved(data);
    });

    // Cleanup on unmount
    return () => {
      console.log("🔌 Disconnecting WebSocket...");
      socket.disconnect();
    };
  }, [sessionId, onSongAdded, onSongVoted, onSongRemoved]);

  return socketRef.current;
}