import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { Song } from "@/services/api";


// SOCKET CONFIGURATION


// Get socket URL from environment variable, fallback to localhost for development
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Check if we're in development mode (for conditional logging)
const isDev = import.meta.env.DEV;




interface UseSocketProps {
  sessionId: string | undefined;
  onSongAdded: (song: Song) => void;
  onSongVoted: (song: Song) => void;
  onSongRemoved: (data: { songId: string }) => void;
}


// HOOK: useSocket


/**
 * Custom hook to manage WebSocket connection for real-time updates
 * 
 * HOW IT WORKS:
 * 1. Connects to the Socket.io server when component mounts
 * 2. Joins a specific session "room" to only receive events for that session
 * 3. Listens for events: song-added, song-voted, song-removed
 * 4. Calls the appropriate callback when events are received
 * 5. Disconnects when component unmounts or sessionId changes
 * 
 * EVENTS FROM SERVER:
 * - "song-added"   → When any user adds a song to the queue
 * - "song-voted"   → When any user votes on a song
 * - "song-removed" → When a song is deleted from the queue
 */
export function useSocket({ sessionId, onSongAdded, onSongVoted, onSongRemoved }: UseSocketProps) {
  
  
  // useRef to persist socket instance across re-renders
  // Why useRef? Because we don't want to reconnect on every render
  
  const socketRef = useRef<Socket | null>(null);

  
  // MAIN EFFECT: Setup and manage WebSocket connection
  
  useEffect(() => {

    // GUARD: Don't connect if no sessionId (user hasn't joined a session yet)

    if (!sessionId) return;


    // STEP 1: Create new socket connection to the server
    // io(SOCKET_URL) creates a Socket.io client that auto-connects

    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
    });


    // STEP 2: Handle successful connection
    // Once connected, join the session-specific room

    socketRef.current.on("connect", () => {
      if (isDev) console.log("WebSocket connected:", socketRef.current?.id);
      
      // Tell server to add this socket to the session room
      // Server uses: socket.join(`session:${sessionId}`)
      socketRef.current?.emit("join-session", sessionId);
      
      if (isDev) console.log(`Joined session room: ${sessionId}`);
    });


    // STEP 3: Handle connection errors (e.g., server is down)

    socketRef.current.on("connect_error", (error) => {
      if (isDev) console.error("WebSocket connection error:", error);
      // Note: Socket.io will auto-retry connection
    });


    // STEP 4: Handle disconnection (e.g., network issues, server restart)

    socketRef.current.on("disconnect", (reason) => {
      if (isDev) console.log("WebSocket disconnected:", reason);
      // Common reasons:
      // - "io server disconnect" → Server forcefully disconnected
      // - "transport close" → Connection lost (network issue)
      // - "ping timeout" → No response from server
    });


    // STEP 5: Listen for "song-added" event
    // Triggered when ANY user in the session adds a new song
    // Server emits: io.to(`session:${sessionId}`).emit("song-added", song)

    socketRef.current.on("song-added", (song: Song) => {
      if (isDev) console.log("Song added event received:", song);
      onSongAdded(song); // Update local state with new song
    });


    // STEP 6: Listen for "song-voted" event
    // Triggered when ANY user in the session votes on a song


    socketRef.current.on("song-voted", (song: Song) => {
      if (isDev) console.log("Song voted event received:", song);
      onSongVoted(song); // Update local state with new vote count
    });


    // STEP 7: Listen for "song-removed" event
    // Triggered when a song is deleted from the queue
    // Server emits: io.to(`session:${sessionId}`).emit("song-removed", { songId })

    socketRef.current.on("song-removed", (data: { songId: string }) => {
      if (isDev) console.log("Song removed event received:", data);
      onSongRemoved(data); // Remove song from local state
    });


   
    // This prevents memory leaks and zombie connections

    return () => {
      if (isDev) console.log("Disconnecting WebSocket...");
      socketRef.current?.disconnect();
    };
  }, [sessionId, onSongAdded, onSongVoted, onSongRemoved]);
  // ↑ Dependencies: Re-run effect if any of these change

  
  // NOTE: We don't return the socket because:
  // 1. All communication is event-based (via callbacks)
  // 2. Returning socketRef.current during render causes lint errors
  // 3. Components don't need direct socket access

}