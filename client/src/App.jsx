import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

const GRID_SIZE = 30;

function App() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [leaderboard, setLeaderboard] = useState({});
  const [color, setColor] = useState("#ff4d4d");

  useEffect(() => {
    socket.on("grid", (data) => {
      setTiles(data);
    });

    socket.on("update", (data) => {
      setTiles(data.tiles);
      setLeaderboard(data.leaderboard);
    });

    socket.on("reset", () => {
      setTiles([]);
      setLeaderboard({});
    });

    return () => {
      socket.off("grid");
      socket.off("update");
      socket.off("reset");
    };
  }, []);

  const joinGame = () => {
    if (!name.trim()) return;
    socket.emit("join", { name, color });
    setJoined(true);
  };

  const paintTile = (id) => {
    socket.emit("paint", id);
  };

  const resetGame = () => {
    socket.emit("reset");
  };

  if (!joined) {
    return (
      <div className="center-screen">
        <h1>Pixel War</h1>
        <input
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button onClick={joinGame}>Join</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div>
        <h1>Pixel War</h1>
        <p>Logged in as {name}</p>

        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`
          }}
        >
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className="tile"
              style={{ backgroundColor: tile.color || "#1e1e1e" }}
              onClick={() => paintTile(tile.id)}
            />
          ))}
        </div>
      </div>

      <div className="sidebar">
        <h2>🏆 Leaderboard</h2>

        {Object.keys(leaderboard).length === 0 ? (
          <p>No tiles captured yet</p>
        ) : (
          Object.entries(leaderboard).map(([user, score]) => (
            <div key={user} className="leader-row">
              <span>{user}</span>
              <span>{score}</span>
            </div>
          ))
        )}

        <div className="color-preview">
          <p>Your Color</p>
          <div
            className="color-box"
            style={{ backgroundColor: color }}
          />
        </div>

        <button className="reset-btn" onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default App;
