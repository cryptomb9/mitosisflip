// src/components/Leaderboard.jsx
import React from "react";

const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: "1blexzy", balance: 200, profit: 150, losses: 50 },
    { rank: 2, name: "2dababy", balance: 100, profit: 80, losses: 20 },
    { rank: 3, name: "3Ahmed", balance: 40, profit: 30, losses: 10 },
    { rank: 4, name: "4Techgee", balance: 0, profit: 0, losses: 0 },
    { rank: 5, name: "5mbagoat", balance: 0, profit: 0, losses: 0 },
    { rank: 6, name: "6las", balance: 0, profit: 0, losses: 0 },
    { rank: 7, name: "7techgee is Gay0", balance: 0, profit: 0, losses: 0 },
    { rank: 8, name: "8Tosin", balance: 0, profit: 0, losses: 0 },
  ];

  return (
    <div className="leaderboard">
      <h2>Top Players</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>Balance</th>
            <th>Profit</th>
            <th>Losses</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player, index) => (
            <tr key={index} className={player.rank <= 3 ? `top-${player.rank}` : ""}>
              <td>#{player.rank}</td>
              <td>{player.name}</td>
              <td>{player.balance} mito</td>
              <td>{player.profit} mito</td>
              <td>{player.losses} mito</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;