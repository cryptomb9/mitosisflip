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

  return (
    <div className={`hamburger-menu ${open ? "open" : ""}`}>
      <button onClick={() => setOpen(false)}>Close Menu</button>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Balance:</strong> {user.balance} mito</p>
      <button onClick={handleUsernameChange}>Change Username</button>
    </div>
  );
};

export default HamburgerMenu;