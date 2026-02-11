require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const GRID_SIZE = 30;

// Initialize grid
async function initGrid() {
  const count = await prisma.tile.count();

  if (count === 0) {
    const tiles = [];

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        tiles.push({
          x,
          y,
          color: "#1e1e1e",
        });
      }
    }

    await prisma.tile.createMany({ data: tiles });
    console.log("Grid initialized");
  }
}

initGrid();

io.on("connection", async (socket) => {
  console.log("User connected");

  const tiles = await prisma.tile.findMany();
  socket.emit("init", tiles);

  socket.on("click", async ({ x, y }) => {
    const updated = await prisma.tile.updateMany({
      where: { x, y },
      data: { color: "#4da6ff" },
    });

    const tile = await prisma.tile.findFirst({
      where: { x, y },
    });

    io.emit("update", tile);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
