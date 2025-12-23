import http from "http";
import { Server } from "socket.io";
import app from "./app";

const PORT = process.env.PORT || 4000;

// Create HTTP server using Express App
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://vote-the-beat-app.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a session room
  socket.on("join-session", (sessionId: string) => {
    socket.join(`session:${sessionId}`);
    console.log(`Socket ${socket.id} joined session:${sessionId}`);
  });

  // Disconnect user
  socket.on("disconnect", () => {
    console.log("User disconnected from the session", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Backend + WebSocket running on http://localhost:${PORT}`);
});

export { io };