import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getSessionSongs,
  getSession,
  addSongToSession,
  voteSong,
  removeSong,
} from "../services/api";
import type { Song, Session } from "../services/api";
import { getUserId } from "../utils/userId";
import { useSocket } from "../hooks/useSocket";
import { searchSongs } from "../services/saavn";
import type { SearchResult } from "../services/saavn";

function Sessionmain() {
  const { id: sessionId } = useParams<{ id: string }>();
  const userId = getUserId();

  const [session, setSession] = useState<Session | null>(null);
  const [query, setQuery] = useState("");
  const [queue, setQueue] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);

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

  // Fetch session and songs on mount
  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [sessionData, songs] = await Promise.all([
          getSession(sessionId),
          getSessionSongs(sessionId),
        ]);
        setSession(sessionData);
        setQueue(songs);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      const results = await searchSongs(query);
      setSearchResults(results);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Search failed");
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
      toast.success("Song added!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add song");
    }
  };

  // Handle vote with animation
  const handleVote = async (songId: string) => {
    try {
      setVotingId(songId);
      await voteSong(songId);
      toast.success("Vote recorded!");
    } catch (err) {
      let errorMessage = "Failed to vote";
      
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          errorMessage = parsed.message || errorMessage;
        } catch {
          errorMessage = err.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setTimeout(() => setVotingId(null), 300);
    }
  };

  // Handle remove
  const handleRemove = async (songId: string) => {
    try {
      await removeSong(songId);
      toast.success("Song removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove song");
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
      <div className="mx-4 md:mx-20 lg:mx-20 mt-20 text-center font-mono text-2xl">
        <div className="animate-pulse">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="mx-4 md:mx-10 lg:mx-20 mt-10 md:mt-10 pb-20">
      {/* Side by Side Container - items-stretch makes both equal height */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-stretch">
        
        {/* LEFT: Search Panel */}
        <div className="w-full lg:w-1/2 flex">
          <div className="bg-white border-2 border-black shadow-[-7px_7px_0px_#000000] p-4 md:p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <span className="text-xl md:text-2xl font-mono font-bold text-black">Search Songs</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for songs, artists..."
                  className="w-full border-2 border-black px-4 py-3 pr-10 font-mono text-black bg-white shadow-[-5px_5px_0px_#000000] outline-none text-sm md:text-base"
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
                           disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Results - flex-1 makes it grow to fill remaining space */}
            <div className="mt-6 flex-1 overflow-y-auto space-y-3 pr-1">
              {searching && (
                <div className="font-mono text-gray-700 text-center py-8">
                  <div className="animate-pulse"> Searching Your song...</div>
                </div>
              )}

              {!searching && searchResults.length > 0 && searchResults.map((song) => {
                const inQueue = queue.some((q) => q.trackId === song.trackId);
                return (
                  <div key={song.trackId} className="flex items-center justify-between border-2 border-black bg-white p-3 shadow-[-4px_4px_0px_#000000]">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={song.cover} alt={song.title} className="h-10 w-10 border-2 border-black object-cover flex-shrink-0" />
                      <div className="font-mono min-w-0">
                        <div className="font-bold text-black text-sm truncate">{song.title}</div>
                        <div className="text-gray-600 text-xs truncate">{song.artist}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddSong(song)}
                      disabled={inQueue}
                      className={`border-2 cursor-pointer border-black font-mono px-3 py-2 shadow-[-3px_3px_0px_#000000] text-sm flex-shrink-0 ml-2 ${
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
        </div>

        {/* RIGHT: Song Queue Panel - grows with content, matches search panel height */}
        <div className="w-full lg:w-1/2 flex">
          <div className="bg-white border-2 border-black shadow-[-7px_7px_0px_#000000] p-4 md:p-6 flex-1">
            <div className="flex items-center gap-2 mb-4 md:mb-6 flex-wrap">
              <span className="text-xl md:text-2xl font-mono font-bold text-black">Song Queue</span>
              <span className="text-sm font-mono text-gray-600">({queue.length} songs)</span>
              <span className="text-xs font-mono text-green-600 ml-2">● LIVE</span>
            </div>

            {queue.length === 0 ? (
              <div className="border-2 border-dashed border-black bg-white p-6 text-center font-mono text-black shadow-[-5px_5px_0px_#000000]">
                <div className="text-lg md:text-xl font-bold">Song Queue is empty!</div>
                <div className="text-sm md:text-base">Search and add songs to get started!</div>
              </div>
            ) : (
              /* Grows with content - no max-h */
              <div className="space-y-3">
                {sortedQueue.map((song, idx) => {
                  const isTop = idx === 0;
                  const isMySong = song.addedBy === userId;
                  const isVoting = votingId === song.id;

                  return (
                    <div
                      key={song.id}
                      className={`flex items-center justify-between border-2 border-black p-3 shadow-[-4px_4px_0px_#000000] transition-all duration-200 ${
                        isTop ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className={`font-mono font-bold text-sm ${isTop ? "text-green-700" : "text-gray-700"}`}>
                            #{idx + 1}
                          </span>
                        </div>
                        <img 
                          src={song.imageUrl || "https://via.placeholder.com/150"} 
                          alt={song.title} 
                          className="h-10 w-10 border-2 border-black object-cover flex-shrink-0" 
                        />
                        <div className="font-mono min-w-0">
                          <div className={`font-bold text-sm truncate ${isTop ? "text-green-700" : "text-black"}`}>
                            {song.title}
                          </div>
                          <div className="text-gray-700 text-xs font-mono truncate">{song.artist}</div>
                          {isMySong && (
                            <div className="text-xs text-blue-600">You added this</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <div className="text-right font-mono">
                          <div 
                            className={`text-base transition-all duration-200 ${
                              isVoting ? "scale-125 text-green-600" : isTop ? "text-green-700" : "text-black"
                            }`}
                          >
                            {song.votes}
                          </div>
                          <div className="text-gray-700 text-xs -mt-1">votes</div>
                        </div>

                        {!isMySong && (
                          <button
                            onClick={() => handleVote(song.id)}
                            disabled={isVoting}
                            className={`border-2 font-mono cursor-pointer border-black px-3 py-2 shadow-[-3px_3px_0px_#000000] text-sm
                              bg-gray-300 text-black hover:bg-gray-400 transition-all duration-200
                              ${isVoting ? "scale-95 bg-green-400" : ""}
                              disabled:cursor-not-allowed`}
                          >
                            {isVoting ? "✓" : "Vote"}
                          </button>
                        )}

                        {/* Show delete button ONLY if no votes */}
                        {isMySong && song.votes === 0 && (
                          <button
                            onClick={() => handleRemove(song.id)}
                            aria-label={`Remove ${song.title}`}
                            className="border-2 cursor-pointer border-black bg-red-600 text-white font-mono px-2 py-2 shadow-[-3px_3px_0px_#000000] hover:bg-red-700 text-sm"
                          >
                            ×
                          </button>
                        )}

                        {/* No button shown when isMySong && song.votes > 0 */}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sessionmain;