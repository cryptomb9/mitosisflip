// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { supabase } from "./supabase/client";

const App = () => {
  useEffect(() => {
    // Handle email magic link login (on redirect)
    const handleSession = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error.message);
      }
    };
    handleSession();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;