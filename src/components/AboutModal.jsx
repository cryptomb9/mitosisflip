// src/components/AboutModal.jsx
import React from "react";

const AboutModal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>How to Play</h3>
        <p>
          Welcome to Mitosis Coin Flip! Here's how to get started:
          <ul>
            <li>Sign in with your email to create or access your account.</li>
            <li>Use the faucet to claim 100 mito daily.</li>
            <li>Choose Heads or Tails and set your wager (min 20 mito).</li>
            <li>Flip the coin to see if you win or lose!</li>
            <li>Check the leaderboard to see top players.</li>
          </ul>
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AboutModal;