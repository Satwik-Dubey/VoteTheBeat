const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export interface SearchResult {
  trackId: string;
  title: string;
  artist: string;
  cover: string;
  album?: string;
}

/**
 * Safely extract artist name from various API response formats
 */
function getArtistName(song: any): string {
  // Format 1: song.artists.primary (array)
  if (song.artists?.primary && Array.isArray(song.artists.primary)) {
    return song.artists.primary.map((a: any) => a.name).join(", ");
  }
  
  // Format 2: song.primaryArtists (string)
  if (song.primaryArtists && typeof song.primaryArtists === "string") {
    return song.primaryArtists;
  }
  
  // Format 3: song.artist (string)
  if (song.artist && typeof song.artist === "string") {
    return song.artist;
  }
  
  // Format 4: song.artists (string)
  if (song.artists && typeof song.artists === "string") {
    return song.artists;
  }

  // Format 5: song.more_info.artistMap.primary_artists
  if (song.more_info?.artistMap?.primary_artists) {
    return song.more_info.artistMap.primary_artists.map((a: any) => a.name).join(", ");
  }

  return "Unknown Artist";
}

/**
 * Safely extract cover image from various API response formats
 */
function getCoverImage(song: any): string {
  const placeholder = "https://via.placeholder.com/150";

  // Format 1: song.image (array of objects with quality/url)
  if (Array.isArray(song.image)) {
    const highQuality = song.image.find((img: any) => img.quality === "500x500");
    return highQuality?.url || highQuality?.link || song.image[song.image.length - 1]?.url || song.image[song.image.length - 1]?.link || placeholder;
  }

  // Format 2: song.image (string)
  if (typeof song.image === "string") {
    return song.image.replace("150x150", "500x500");
  }

  // Format 3: song.images (object with different sizes)
  if (song.images) {
    return song.images["500x500"] || song.images["150x150"] || placeholder;
  }

  return placeholder;
}

/**
 * Search songs on Saavn (via backend proxy)
 */
export async function searchSongs(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/saavn/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Failed to search songs");
    }

    const data = await response.json();
    console.log("Saavn API response:", data);

    // Handle different response structures
    const results = data.data?.results || data.results || data.data || [];

    if (!results || results.length === 0) {
      return [];
    }

    return results.map((song: any) => ({
      trackId: song.id,
      title: song.name || song.title || "Unknown Title",
      artist: getArtistName(song),
      cover: getCoverImage(song),
      album: song.album?.name || song.album || undefined,
    }));
  } catch (error) {
    console.error("Saavn API error:", error);
    throw new Error("Failed to search songs. Please try again.");
  }
}

/**
 * Get song details by ID (via backend proxy)
 */
export async function getSongById(songId: string): Promise<SearchResult | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saavn/song/${songId}`);

    if (!response.ok) return null;

    const data = await response.json();
    const song = data.data?.[0] || data[0] || data.data || data;

    if (!song) return null;

    return {
      trackId: song.id,
      title: song.name || song.title || "Unknown Title",
      artist: getArtistName(song),
      cover: getCoverImage(song),
      album: song.album?.name || song.album || undefined,
    };
  } catch (error) {
    console.error("Failed to fetch song details:", error);
    return null;
  }
}