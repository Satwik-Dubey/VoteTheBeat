import { useState } from "react"

type Song = { id: string; title: string; artist: string; cover: string }
type QueueSong = Song & { votes: number }

const MOCK_SONGS: Song[] = [
  { id: "1", title: "Danza Kuduro", artist: "Don Omar", cover: "https://i.scdn.co/image/ab67616d00001e026b0f2c6ff9c821e4d0f5f1a6" },
  { id: "2", title: "Danza Kuduro - Remix", artist: "W&W",       cover: "https://i.scdn.co/image/ab67616d00001e02b8b6a0c2e682f5f46a3e6c5d" },
]

// Initial queue with two items (second is a different song for demo)
const INITIAL_QUEUE: QueueSong[] = [
  { id: "1", title: "Danza Kuduro", artist: "Don Omar", cover: "https://i.scdn.co/image/ab67616d00001e026b0f2c6ff9c821e4d0f5f1a6", votes: 0 },
  { id: "3", title: "Dhoom Machale Dhoom", artist: "Pritam", cover: "https://i.scdn.co/image/ab67616d00001e0212ed1f5fb142dfd2a4d1e3a8", votes: 0 },
]

function Sessionmain() {
  const [query, setQuery] = useState("")
  const [queue, setQueue] = useState<QueueSong[]>(INITIAL_QUEUE)

  const sortQueue = (arr: QueueSong[]) => [...arr].sort((a, b) => b.votes - a.votes)

  const addToQueue = (song: Song) =>
    setQueue((prev) => (prev.some((s) => s.id === song.id) ? prev : sortQueue([...prev, { ...song, votes: 0 }])))

  const handleVote = (id: string) =>
    setQueue((prev) => sortQueue(prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s))))

  const handleRemove = (id: string) => setQueue((prev) => prev.filter((s) => s.id !== id))

  const results =
    query.trim() === ""
      ? []
      : MOCK_SONGS.filter(
          (s) =>
            s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.artist.toLowerCase().includes(query.toLowerCase())
        )

  return (
    <div className="mx-80 mt-20">
      {/* Search panel */}
      <div className="bg-white border-2 border-black shadow-[-7px_7px_0px_#000000] p-6 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl font-mono font-bold text-black">Search Songs</span>
        </div>

        <div className="flex gap-4">
          {/* Input with inline clear button */}
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full border-2 border-black px-4 py-3 pr-10 font-mono text-black bg-white shadow-[-5px_5px_0px_#000000] outline-none"
            />
            {query.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 h-7 w-7 border-2 border-black bg-white text-black shadow-[-3px_3px_0px_#000000] rounded flex items-center justify-center hover:bg-gray-100"
              >
                {/* X icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <button
            type="button"
            className="relative cursor-pointer border-2 bg-green-600 font-extrabold font-mono py-2.5 px-6 text-gray-800 border-black shadow-[-7px_7px_0px_#000000]
                       before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0
                       before:bg-gray-800 before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100"
            onClick={() => {}}
          >
            Search
          </button>
        </div>

        {/* Results */}
        <div className="mt-6 max-h-96 overflow-y-auto space-y-4 pr-1">
          {results.map((song) => {
            const inQueue = queue.some((q) => q.id === song.id)
            return (
              <div key={song.id} className="flex items-center justify-between border-2 border-black bg-white p-4 shadow-[-5px_5px_0px_#000000]">
                <div className="flex items-center gap-4">
                  <img src={song.cover} alt={song.title} className="h-12 w-12 border-2 border-black object-cover" />
                  <div className="font-mono">
                    <div className="font-bold text-black">{song.title}</div>
                    <div className="text-gray-600 text-sm">{song.artist}</div>
                  </div>
                </div>
                <button
                  onClick={() => addToQueue(song)}
                  disabled={inQueue}
                  className={`border-2 cursor-pointer border-black font-mono px-4 py-2 shadow-[-4px_4px_0px_#000000] ${
                    inQueue ? "bg-gray-300 text-black cursor-not-allowed" : "bg-green-600 text-gray-800 hover:bg-green-700"
                  }`}
                >
                  {inQueue ? "Added" : "Add"}
                </button>
              </div>
            )
          })}

          {query.trim() !== "" && results.length === 0 && (
            <div className="font-mono text-gray-700">No results. Try another search.</div>
          )}
        </div>
      </div>

      {/* Song Queue panel */}
      <div className="bg-white border-2 border-black mb-20 shadow-[-7px_7px_0px_#000000] p-6 max-w-4xl mt-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl font-mono font-bold text-black">Song Queue</span>
        </div>

        {queue.length === 0 ? (
          <div className="border-2 border-dashed border-black bg-white p-6 text-center font-mono text-black shadow-[-5px_5px_0px_#000000]">
            <div className="text-xl font-bold">Song Queue is empty!</div>
            <div>No songs is added yet</div>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((song, idx) => {
              const isTop = idx === 0
              return (
                <div
                  key={song.id}
                  className={`flex items-center justify-between border-2 border-black p-4 shadow-[-5px_5px_0px_#000000] ${
                    isTop ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-mono font-bold ${isTop ? "text-green-700" : "text-gray-700"}`}>#{idx + 1}</span>
                    <img src={song.cover} alt={song.title} className="h-12 w-12 border-2 border-black object-cover" />
                    <div className="font-mono">
                      <div className={`font-bold ${isTop ? "text-green-700" : "text-black"}`}>{song.title}</div>
                      <div className="text-gray-700 text-sm font-mono">{song.artist}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <div className={`${isTop ? "text-green-700" : "text-black"} text-lg`}>{song.votes}</div>
                      <div className="text-gray-700 text-xs -mt-1">votes</div>
                    </div>

                    <button
                      onClick={() => handleVote(song.id)}
                      className="border-2 font-mono cursor-pointer border-black bg-gray-300 text-black font-mono px-4 py-2 shadow-[-4px_4px_0px_#000000] hover:bg-gray-400"
                    >
                      Vote
                    </button>

                    <button
                      onClick={() => handleRemove(song.id)}
                      aria-label={`Remove ${song.title}`}
                      className="border-2 cursor-pointer border-black bg-red-600 text-white font-mono px-3 py-2 shadow-[-4px_4px_0px_#000000] hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sessionmain