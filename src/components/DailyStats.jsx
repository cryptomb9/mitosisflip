import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const DailyStats = () => {
  const [mitoWonToday, setMitoWonToday] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // set to midnight UTC
      const isoToday = today.toISOString();

      const { data, error } = await supabase
        .from("results")
        .select("amount, timestamp")
        .gte("timestamp", isoToday);

      if (error) {
        console.error("❌ Error fetching daily stats:", error.message);
        return;
      }

      const total = data.reduce((sum, row) => sum + (row.amount || 0), 0);
      setMitoWonToday(total);
    };

    fetchStats();

    // Optional: update every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="daily-stats">
      <p>Mito won today: {mitoWonToday}</p>
    </div>
  );
};

export default DailyStats;