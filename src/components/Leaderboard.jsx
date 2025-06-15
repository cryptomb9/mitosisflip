import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

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
      const sorted = data.map((player, index) => ({
        rank: index + 1,
        ...player,
      }));
      setLeaderboardData(sorted);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel("realtime-players")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

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
              <td>{player.rank}</td>
              <td>{player.username || "Anonymous"}</td>
              <td>{player.balance} mito</td>
              <td>{player.profit || 0} mito</td>
              <td>{player.losses || 0} mito</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;