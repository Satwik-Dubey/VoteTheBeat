import express from "express";
import cors from "cors";
import sessionRoutes from "./routes/session.routes";
import voteRoutes from "./routes/vote.routes";
import sessionSongsRoutes from "./routes/sessionSongs.routes";
import songRoutes from "./routes/song.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/sessions", sessionRoutes);
app.use("/songs", voteRoutes);
app.use("/sessions", sessionSongsRoutes);
app.use("/songs", songRoutes);

// ============= SAAVN PROXY ROUTES =============

// List of public JioSaavn API instances (fallbacks)
const SAAVN_APIS = [
  "https://saavn.dev/api",
  "https://jiosaavn-api-privatecvc2.vercel.app",
  "https://saavn.me/api",
  "https://jio-savaan-private.vercel.app/api",
  "https://jiosaavn-api-ts.vercel.app",
];

// Helper function to try multiple APIs
async function fetchWithFallback(path: string): Promise<any> {
  let lastError: Error | null = null;

  for (const baseUrl of SAAVN_APIS) {
    const url = `${baseUrl}${path}`;

    try {
      console.log(`Trying: ${url}`);

      const response = await fetch(url, {
        headers: {
          "User-Agent": "VoteTheBeat/1.0",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Success with: ${baseUrl}`);
        return data;
      }

      console.log(`Failed (${response.status}): ${baseUrl}`);
    } catch (error) {
      console.log(`Error with ${baseUrl}:`, error);
      lastError = error as Error;
    }
  }

  throw lastError || new Error("All Saavn APIs failed");
}

// Search songs
app.get("/api/saavn/search", async (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    console.log("Searching Saavn for:", query);

    const data = await fetchWithFallback(
      `/search/songs?query=${encodeURIComponent(query)}&limit=10`
    );

    console.log("Found", data.data?.results?.length || 0, "results");
    res.json(data);
  } catch (error) {
    console.error("All Saavn APIs failed:", error);
    res.status(500).json({
      error: "All music APIs are currently unavailable. Please try again later.",
    });
  }
});

// Get song by ID
app.get("/api/saavn/song/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await fetchWithFallback(`/songs/${id}`);
    res.json(data);
  } catch (error) {
    console.error("All Saavn APIs failed:", error);
    res.status(500).json({ error: "Failed to fetch song" });
  }
});

export default app;