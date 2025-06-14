import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const DailyStats = () => {
  const [mitoWonToday, setMitoWonToday] = useState(0);

  useEffect(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const isoToday = today.toISOString();

    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("results")
        .select("amount")
        .gte("timestamp", isoToday);
      if (!error && data) {
        const total = data.reduce((sum, row) => sum + (row.amount || 0), 0);
        setMitoWonToday(total);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="daily-stats">
      <p>Mito won today: {mitoWonToday}</p>
    </div>
  );
};

export default DailyStats;