import React, { useState } from "react";
import { supabase } from "../supabase/client";
import mitosisLogo from "../assets/mitosis-logo.png";
import { updatePlayerStats } from "./updatePlayerStats";

const GameBoard = ({ user }) => {
  const [choice, setChoice] = useState("heads");
  const [wager, setWager] = useState(20);
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(user.balance || 0);
  const [message, setMessage] = useState("");

  const flipCoin = async () => {
    if (wager < 10) {
      setMessage("Minimum wager: 10 mito");
      return;
    }
    if (balance < wager) {
      setMessage("Insufficient balance");
      return;
    }

    const winChance = 0.5;
    const isWin = Math.random() < winChance;

    setFlipping(true);
    setMessage("Flipping...");
    await new Promise((res) => setTimeout(res, 1500));

    const outcome = Math.random() > 0.5 ? "heads" : "tails";
    const didWin = isWin && outcome === choice;

    const newBalance = didWin ? balance + wager : balance - wager;
    setBalance(newBalance);
    setResult({ outcome, didWin });
    setFlipping(false);
    setMessage(didWin ? `You won ${wager} mito!` : `You lost ${wager} mito!`);

    await supabase
      .from("players")
      .update({ balance: newBalance })
      .eq("id", user.id);

    if (didWin) {
      await supabase.from("results").insert({
        user_id: user.id,
        won: true,
        amount: wager,
        timestamp: new Date().toISOString(),
      });
    }

    // 🔁 Update player stats (profit/loss) after result
    await updatePlayerStats(user.username, didWin ? "win" : "lose");
  };

  return (
    <div className="game-board">
      <div className={`coin ${flipping ? "flipping" : ""}`}>
        <img src={mitosisLogo} alt="Coin" className="coin-image" />
      </div>

      <div className="wager-input">
        <label>Wager (min 20 mito):</label>
        <input
          type="number"
          value={wager}
          onChange={(e) => setWager(Number(e.target.value))}
          min="20"
        />
      </div>

      <div className="choice-buttons">
        <button
          className={choice === "heads" ? "active" : ""}
          onClick={() => setChoice("heads")}
        >
          Heads
        </button>
        <button
          className={choice === "tails" ? "active" : ""}
          onClick={() => setChoice("tails")}
        >
          Tails
        </button>
      </div>

      <button onClick={flipCoin} disabled={flipping} className="flip-button">
        Flip Coin
      </button>

      {result && (
        <div className="result">
          <p>Outcome: {result.outcome}</p>
          <p>{result.didWin ? "🎉 You Won!" : "😓 You Lost"}</p>
        </div>
      )}

      <div className="balance">
        <p>Balance: {balance} mito</p>
      </div>

      <p className="message">{message}</p>
    </div>
  );
};

export default GameBoard;