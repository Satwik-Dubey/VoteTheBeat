import { getUserId } from "../utils/userId";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// ============= TYPES =============

export type Song = {
  id: string;
  trackId: string;
  title: string;
  artist: string;
  imageUrl: string | null;
  addedBy: string;
  votes: number;
  sessionId: string;
  createdAt: string;
};

export type Session = {
  id: string;
  name: string;
  createdAt: string;
};

// ============= SESSION APIs =============

export async function createSession(name: string): Promise<Session> {
  const res = await fetch(`${API_BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSession(sessionId: string): Promise<Session> {
  const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSessionSongs(sessionId: string): Promise<Song[]> {
  const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/songs`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addSongToSession(
  sessionId: string,
  song: { trackId: string; title: string; artist: string; imageUrl?: string }
): Promise<Song> {
  const userId = getUserId();
  const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/songs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...song, addedBy: userId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function voteSong(songId: string): Promise<Song> {
  const userId = getUserId();
  const res = await fetch(`${API_BASE_URL}/songs/${songId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to vote");  // Extract just the message
  }
  
  return res.json();
}

export async function removeSong(songId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/songs/${songId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
}