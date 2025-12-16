import http from "http";
import app from "./app";
import {Server} from "socket.io";
import { Socket } from "dgram";

const PORT=4000;

// Create HTTP server using Express App
const server=http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // frontend later (we’ll do this down)
  },
});

// Handlie socket connections
io.on("connection",(socket)=>{
  console.log("User connected:",socket.id);

  // user joins a session room
  /// It puts a connected user into a specific session room So the server can send messages only to users of that session
  socket.on("join-session",(sessionId:String)=>{  //"join-session" is a built-in Socket.IO event
    //It adds this socket (user) into a room
    socket.join(`session:${sessionId}`);
     console.log(`Socket ${socket.id} joined session:${sessionId}`);
  });

  // disconnect user
  socket.on("disconnect",()=>{       // "disconnect" is a built-in Socket.IO event
    console.log("User disconnected from the session",socket.id);

  });

});

// Start server
server.listen(PORT, () => {
  console.log(`Backend + WebSocket running on http://localhost:${PORT}`);
});


export { io };

