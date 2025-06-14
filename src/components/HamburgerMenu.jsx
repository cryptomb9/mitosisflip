import React from "react";
import { supabase } from "../supabase/client";

const HamburgerMenu = ({ user, open, setOpen }) => {
  const handleUsernameChange = async () => {
    const newUsername = prompt("Enter new username:");
    if (!newUsername) return;

    const { error } = await supabase
      .from("players")
      .update({ username: newUsername })
      .eq("id", user.id);

    if (error) {
      alert("Error updating username: " + error.message);
    } else {
      alert("Username updated. Refreshing...");
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className={`hamburger-menu ${open ? "open" : ""}`}>
      <button className="close-btn" onClick={() => setOpen(false)}>
        ✕
      </button>

      {user ? (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Balance:</strong> {user.balance} mito</p>
          <button onClick={handleUsernameChange}>Change Username</button>
          <button onClick={handleLogout}>Logout</button>
          <hr />
          <h4>How to Play</h4>
          <ul>
            <li>Stake at least 20 mito.</li>
            <li>Pick heads or tails.</li>
            <li>Win = double your stake. Lose = lose it.</li>
            <li>Daily claim = 100 mito (UTC 12am reset).</li>
            <li>Leaderboard ranks by total mito *won*.</li>
          </ul>
          <hr />
          <p>Need help? DM us on Discord.</p>
        </>
      ) : (
        <p>Please log in to see your profile.</p>
      )}
    </div>
  );
};

export default HamburgerMenu;