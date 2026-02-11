import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const GRID_SIZE = 30;

function App() {
  const [tiles, setTiles] = useState([]);

  useEffect(() => {
    socket.on("init", (data) => {
      setTiles(data);
    });

    socket.on("update", (tile) => {
      setTiles((prev) =>
        prev.map((t) =>
          t.x === tile.x && t.y === tile.y ? tile : t
        )
      );
    });
  }, []);

  const handleClick = (x, y) => {
    socket.emit("click", { x, y });
  };

  return (
    <div
      style={{
        background: "#000",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          gap: "2px",
        }}
      >
        {tiles.map((tile) => (
          <div
            key={`${tile.x}-${tile.y}`}
            onClick={() => handleClick(tile.x, tile.y)}
            style={{
              width: 20,
              height: 20,
              backgroundColor: tile.color || "#1e1e1e",
              borderRadius: 4,
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
