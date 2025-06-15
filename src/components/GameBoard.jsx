// src/components/GameBoard.jsx
import React, { useState } from "react";

const GameBoard = ({ user }) => {
  const [wager, setWager] = useState(20);
  const [choice, setChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);

  const handleFlip = () => {
    if (!user || wager < 20 || !choice) return alert("Select a wager (min 20 mito) and choice!");
    setFlipping(true);
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? "heads" : "tails";
      setResult(outcome === choice ? "You Won!" : "You Lost!");
      if (outcome === choice) {
        // Simulate balance update (replace with Supabase later)
        // setUser({ ...user, balance: user.balance + wager });
      } else {
        // setUser({ ...user, balance: user.balance - wager });
      }
      setFlipping(false);
    }, 1500);
  };

  return (
    <div className="game-board">
      <div className="wager-input">
        <label>Wager (min 20 mito):</label>
        <input
          type="number"
          value={wager}
          onChange={(e) => setWager(Math.max(20, parseInt(e.target.value) || 20))}
          min="20"
        />
      </div>
      <div className="choice-buttons">
        <button className={choice === "heads" ? "active" : ""} onClick={() => setChoice("heads")}>
          Heads
        </button>
        <button className={choice === "tails" ? "active" : ""} onClick={() => setChoice("tails")}>
          Tails
        </button>
      </div>
      <button className="flip-button" onClick={handleFlip} disabled={!choice || flipping}>
        Flip Coin
      </button>
      <div className="coin" style={{ opacity: flipping ? 0.5 : 1 }}>
        <img
          src="https://via.placeholder.com/120?text=Coin"
          alt="Coin"
          className={`coin-image ${flipping ? "flipping" : ""}`}
        />
      </div>
      {result && <p className="result">{result}</p>}
    </div>
  );
};

export default GameBoard;