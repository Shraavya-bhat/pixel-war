import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = 5000;

const GRID_SIZE = 30;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
const WIN_COUNT = 50;

let tiles = Array(TOTAL_TILES).fill(null);
let players = {};
let winner = null;

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", ({ name, color }) => {
    players[socket.id] = { name, color, score: 0 };

    socket.emit("init", { tiles, players, winner });
    io.emit("players", players);
  });

  socket.on("placeTile", (index) => {
    if (winner) return;
    if (tiles[index] !== null) return;

    const player = players[socket.id];
    if (!player) return;

    tiles[index] = player.color;
    player.score++;

    if (player.score >= WIN_COUNT) {
      winner = player.name;
    }

    io.emit("update", { tiles, players, winner });
  });

  socket.on("reset", () => {
    if (!winner) return;

    tiles = Array(TOTAL_TILES).fill(null);
    winner = null;

    Object.values(players).forEach(p => p.score = 0);

    io.emit("update", { tiles, players, winner });
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("players", players);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
