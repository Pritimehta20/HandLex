// signaling/server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // adjust if needed

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Signaling server is running");
});

// userId -> socket.id
const users = new Map();

io.on("connection", (socket) => {
  console.log("client connected", socket.id);

  socket.on("register-user", (userId) => {
    if (!userId) return;
    users.set(String(userId), socket.id);
    console.log("registered user", userId, "->", socket.id);
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("signal", ({ roomId, data }) => {
    socket.to(roomId).emit("signal", { from: socket.id, data });
  });

  // caller -> callee
  socket.on("call-user", ({ toUserId, fromUserId, roomId }) => {
    const targetSocketId = users.get(String(toUserId));
    console.log("call-user to", toUserId, "->", targetSocketId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", {
        fromUserId,
        roomId,
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of users.entries()) {
      if (sid === socket.id) users.delete(uid);
    }
  });
});

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`Signaling server listening on http://localhost:${PORT}`);
});
