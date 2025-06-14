import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const Leaderboard = () => {
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("username, rank, balance")
        .order("balance", { ascending: false })
        .limit(100);
      if (!error) setTopPlayers(data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard">
      <h2>🏆 Top 100 Players</h2>
      <ul className="leaderboard-list">
        {topPlayers.map((player, index) => {
          const rankClass =
            index === 0
              ? "top-1"
              : index === 1
              ? "top-2"
              : index === 2
              ? "top-3"
              : "";

          return (
            <div key={index} className={`leaderboard-entry ${rankClass}`}>
              <span className="rank">#{index + 1}</span>
              <span className="username">{player.username || "Guest"}</span>
              <span className="balance">{player.balance} mito</span>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Leaderboard;