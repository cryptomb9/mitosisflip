import React, { useState } from "react";
import { supabase } from "../supabase/client";

const HamburgerMenu = ({ user, open, setOpen }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

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
          <h3>{user.balance} mito</h3>

          <button onClick={() => setShowProfile(!showProfile)}>Profile</button>
          {showProfile && (
            <div className="profile-info">
              <p><strong>Name:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          )}

          <button onClick={handleUsernameChange}>Edit Username</button>

          <button onClick={() => setShowInstructions(!showInstructions)}>
            How to Play
          </button>
          {showInstructions && (
            <ul className="instructions">
              <li>Stake at least 20 mito.</li>
              <li>Pick heads or tails.</li>
              <li>Win = double your stake. Lose = lose it.</li>
              <li>Daily claim = 100 mito (UTC 12am reset).</li>
              <li>Leaderboard ranks by total mito won.</li>
            </ul>
          )}

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please sign in to view menu</p>
      )}
    </div>
  );
};

export default HamburgerMenu;