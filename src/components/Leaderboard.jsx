// src/components/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("balance", { ascending: false });

    if (error) {
      console.error("Error fetching leaderboard:", error.message);
    } else {
      const sorted = data
        .sort((a, b) => b.balance - a.balance)
        .map((player, index) => ({
          rank: index + 1,
          ...player,
        }));
      setLeaderboardData(sorted);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // 🔁 Subscribe to realtime updates
    const channel = supabase
      .channel("realtime-players")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        (payload) => {
          console.log("⚡ Realtime update:", payload);
          fetchLeaderboard(); // Refresh the leaderboard
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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