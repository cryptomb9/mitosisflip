// src/components/updatePlayerStats.js
import { supabase } from "../supabase/client";

export const updatePlayerStats = async (name, outcome) => {
  const { data, error } = await supabase
    .from("players")
    .select("balance, profit, losses")
    .eq("name", name)
    .single();

  if (error) {
    console.error("❌ Error fetching player:", error.message);
    return;
  }

  let { balance, profit, losses } = data;

  if (outcome === "win") {
    balance += 50;
    profit += 50;
  } else if (outcome === "lose") {
    balance -= 20;
    losses += 20;
  }

  const { error: updateError } = await supabase
    .from("players")
    .update({ balance, profit, losses })
    .eq("name", name);

  if (updateError) {
    console.error("❌ Error updating stats:", updateError.message);
  } else {
    console.log("✅ Stats updated for", name);
  }
};