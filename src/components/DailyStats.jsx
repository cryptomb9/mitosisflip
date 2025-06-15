// src/components/DailyStats.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const DailyStats = () => {
  const [mitoWonToday, setMitoWonToday] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalLosses, setTotalLosses] = useState(0);
  const [dailyClaims, setDailyClaims] = useState(0);

  useEffect(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const isoToday = today.toISOString();

    const fetchStats = async () => {
      try {
        // Mito won today from results table
        const { data: resultsData, error: resultsError } = await supabase
          .from("results")
          .select("amount")
          .gte("timestamp", isoToday);
        if (resultsError) throw resultsError;
        const total = resultsData.reduce((sum, row) => sum + (row.amount || 0), 0);
        setMitoWonToday(total);

        // Total wins (assuming a 'result' field where 'win' indicates success)
        const { data: winsData, error: winsError } = await supabase
          .from("results")
          .select("*", { count: "exact" })
          .eq("result", "win");
        if (winsError) throw winsError;
        setTotalWins(winsData.length);

        // Total losses (assuming a 'result' field where 'loss' indicates failure)
        const { data: lossesData, error: lossesError } = await supabase
          .from("results")
          .select("*", { count: "exact" })
          .eq("result", "loss");
        if (lossesError) throw lossesError;
        setTotalLosses(lossesData.length);

        // Daily claims (count of faucet_claims today)
        const { data: claimsData, error: claimsError } = await supabase
          .from("faucet_claims")
          .select("*", { count: "exact" })
          .gte("claimed_at", isoToday);
        if (claimsError) throw claimsError;
        setDailyClaims(claimsData.length);
      } catch (err) {
        console.error("Failed to fetch stats:", err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="daily-stats">
      <p><strong>Mito won today:</strong> {mitoWonToday}</p>
      <p><strong>Total Wins:</strong> {totalWins}</p>
      <p><strong>Total Losses:</strong> {totalLosses}</p>
      <p><strong>Daily Claims:</strong> {dailyClaims}</p>
    </div>
  );
};

export default DailyStats;