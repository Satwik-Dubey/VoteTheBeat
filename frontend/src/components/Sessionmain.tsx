import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getSessionSongs, addSongToSession, voteSong, removeSong } from "../services/api";
import type { Song } from "../services/api";
import { getUserId } from "../utils/userId";
import { useSocket } from "../hooks/useSocket";
import { searchSongs } from "../services/saavn";
import type { SearchResult } from "../services/saavn";

function Sessionmain() {
  const { id: sessionId } = useParams<{ id: string }>();
  const userId = getUserId();

  const [query, setQuery] = useState("");
  const [queue, setQueue] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  // WebSocket event handlers
  const handleSongAdded = useCallback((song: Song) => {
    setQueue((prev) => {
      if (prev.some((s) => s.id === song.id)) return prev;
      return [...prev, song];
    });
  }, []);

  const handleSongVoted = useCallback((updatedSong: Song) => {
    setQueue((prev) =>
      prev.map((s) => (s.id === updatedSong.id ? updatedSong : s))
    );
  }, []);

  const handleSongRemoved = useCallback((data: { songId: string }) => {
    setQueue((prev) => prev.filter((s) => s.id !== data.songId));
  }, []);

  // Initialize WebSocket
  useSocket({
    sessionId,
    onSongAdded: handleSongAdded,
    onSongVoted: handleSongVoted,
    onSongRemoved: handleSongRemoved,
  });

  // Fetch songs on mount
  useEffect(() => {
    if (!sessionId) return;

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const songs = await getSessionSongs(sessionId);
        setQueue(songs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [sessionId]);

  // Sort queue by votes
  const sortedQueue = [...queue].sort((a, b) => b.votes - a.votes);

  // Handle search
  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setSearching(true);
      setHasSearched(true);
      setError("");
      const results = await searchSongs(query);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Handle add song
  const handleAddSong = async (song: SearchResult) => {
    if (!sessionId) return;

    try {
      await addSongToSession(sessionId, {
        trackId: song.trackId,
        title: song.title,
        artist: song.artist,
        imageUrl: song.cover,
      });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add song");
    }
  };

  // Handle vote
  const handleVote = async (songId: string) => {
    try {
      await voteSong(songId);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote");
    }
  };

  // Handle remove
  const handleRemove = async (songId: string) => {
    try {
      await removeSong(songId);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove song");
    }
  };

  // Handle Enter key in search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="mx-80 mt-20 text-center font-mono text-2xl">
        Loading songs...
      </div>
    );
  }

  return (
    <div className="mx-80 mt-20">
      {/* Error message */}
      {error && (
        <div className="mb-4 border-2 border-red-600 bg-red-100 p-4 font-mono text-red-600 shadow-[-5px_5px_0px_#000000]">
          {error}
          <button
            onClick={() => setError("")}
            className="float-right text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Search panel */}
      <div className="bg-white border-2 border-black shadow-[-7px_7px_0px_#000000] p-6 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl font-mono font-bold text-black">Search Songs</span>
          <span className="text-xs font-mono text-gray-500">(Powered by Saavn)</span>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for songs, artists, albums..."
              className="w-full border-2 border-black px-4 py-3 pr-10 font-mono text-black bg-white shadow-[-5px_5px_0px_#000000] outline-none"
            />
            {query.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  setSearchResults([]);
                  setHasSearched(false);
                }}
                className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 h-7 w-7 border-2 border-black bg-white text-black shadow-[-3px_3px_0px_#000000] rounded flex items-center justify-center hover:bg-gray-100"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            className="relative cursor-pointer border-2 bg-green-600 font-extrabold font-mono py-2.5 px-6 text-gray-800 border-black shadow-[-7px_7px_0px_#000000]
                       before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0
                       before:bg-gray-800 before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Results */}
        <div className="mt-6 max-h-96 overflow-y-auto space-y-4 pr-1">
          {searching && (
            <div className="font-mono text-gray-700 text-center py-8">
              🔍 Searching Saavn...
            </div>
          )}

          {!searching && searchResults.length > 0 && searchResults.map((song) => {
            const inQueue = queue.some((q) => q.trackId === song.trackId);
            return (
              <div key={song.trackId} className="flex items-center justify-between border-2 border-black bg-white p-4 shadow-[-5px_5px_0px_#000000]">
                <div className="flex items-center gap-4">
                  <img src={song.cover} alt={song.title} className="h-12 w-12 border-2 border-black object-cover" />
                  <div className="font-mono">
                    <div className="font-bold text-black">{song.title}</div>
                    <div className="text-gray-600 text-sm">{song.artist}</div>
                    {song.album && <div className="text-gray-500 text-xs">{song.album}</div>}
                  </div>
                </div>
                <button
                  onClick={() => handleAddSong(song)}
                  disabled={inQueue}
                  className={`border-2 cursor-pointer border-black font-mono px-4 py-2 shadow-[-4px_4px_0px_#000000] ${
                    inQueue ? "bg-gray-300 text-black cursor-not-allowed" : "bg-green-600 text-gray-800 hover:bg-green-700"
                  }`}
                >
                  {inQueue ? "Added" : "Add"}
                </button>
              </div>
            );
          })}

          {!searching && hasSearched && searchResults.length === 0 && (
            <div className="font-mono text-gray-700 text-center py-8">
              No results found. Try a different search term.
            </div>
          )}

          {!searching && !hasSearched && (
            <div className="font-mono text-gray-700 text-center py-8">
              Type something and click Search to find songs!
            </div>
          )}
        </div>
      </div>

      {/* Song Queue panel */}
      <div className="bg-white border-2 border-black mb-20 shadow-[-7px_7px_0px_#000000] p-6 max-w-4xl mt-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl font-mono font-bold text-black">Song Queue</span>
          <span className="text-sm font-mono text-gray-600">({queue.length} songs)</span>
          <span className="text-xs font-mono text-green-600 ml-2">● LIVE</span>
        </div>

        {queue.length === 0 ? (
          <div className="border-2 border-dashed border-black bg-white p-6 text-center font-mono text-black shadow-[-5px_5px_0px_#000000]">
            <div className="text-xl font-bold">Song Queue is empty!</div>
            <div>Search and add songs above to get started!</div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedQueue.map((song, idx) => {
              const isTop = idx === 0;
              const isMySong = song.addedBy === userId;

              return (
                <div
                  key={song.id}
                  className={`flex items-center justify-between border-2 border-black p-4 shadow-[-5px_5px_0px_#000000] transition-all ${
                    isTop ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-mono font-bold ${isTop ? "text-green-700" : "text-gray-700"}`}>#{idx + 1}</span>
                    <img src={song.imageUrl || ""} alt={song.title} className="h-12 w-12 border-2 border-black object-cover" />
                    <div className="font-mono">
                      <div className={`font-bold ${isTop ? "text-green-700" : "text-black"}`}>{song.title}</div>
                      <div className="text-gray-700 text-sm font-mono">{song.artist}</div>
                      {isMySong && <div className="text-xs text-blue-600 mt-1">You added this</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <div className={`${isTop ? "text-green-700" : "text-black"} text-lg font-bold`}>{song.votes}</div>
                      <div className="text-gray-700 text-xs -mt-1">votes</div>
                    </div>

                    <button
                      onClick={() => handleVote(song.id)}
                      disabled={isMySong}
                      className={`border-2 font-mono cursor-pointer border-black px-4 py-2 shadow-[-4px_4px_0px_#000000] ${
                        isMySong
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-300 text-black hover:bg-gray-400"
                      }`}
                    >
                      Vote
                    </button>

                    {isMySong && (
                      <button
                        onClick={() => handleRemove(song.id)}
                        aria-label={`Remove ${song.title}`}
                        className="border-2 cursor-pointer border-black bg-red-600 text-white font-mono px-3 py-2 shadow-[-4px_4px_0px_#000000] hover:bg-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Debug info */}
      <div className="text-xs font-mono text-gray-500 mb-20">
        Your User ID: {userId.slice(0, 8)}...
      </div>
    </div>
  );
}

export default Sessionmain;