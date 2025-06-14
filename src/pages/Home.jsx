import React, { useEffect, useState } from "react";
import GameBoard from "../components/GameBoard";
import Leaderboard from "../components/Leaderboard";
import DailyStats from "../components/DailyStats";
import HamburgerMenu from "../components/HamburgerMenu";
import { supabase } from "../supabase/client";

const Home = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: playerData } = await supabase
          .from("players")
          .select("rank, balance, username")
          .eq("id", authUser.id)
          .single();

        let profile = playerData;

        if (!profile) {
          const username = prompt("Enter your username:");
          if (username) {
            const { data: insertedData, error: insertError } = await supabase
              .from("players")
              .insert([{ id: authUser.id, username, balance: 100 }])
              .select()
              .single();

            if (insertError) {
              console.error("Insert failed:", insertError.message);
              setCheckingAuth(false);
              return;
            }

            profile = insertedData;
          }
        }

        setUser({
          ...authUser,
          rank: profile?.rank,
          balance: profile?.balance,
          username: profile?.username,
        });
      }

      setCheckingAuth(false);
    };

    getUser();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw new Error(error.message);
      alert("Check your email for the magic link!");
    } catch (error) {
      alert("Sign-in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFaucet = async () => {
    if (!user) return alert("Please sign in!");
    const today = new Date().toISOString().split("T")[0];

    const { data: lastClaim } = await supabase
      .from("faucet_claims")
      .select("claimed_at")
      .eq("user_id", user.id)
      .order("claimed_at", { ascending: false })
      .limit(1);

    if (lastClaim?.[0]?.claimed_at?.split("T")[0] === today) {
      return alert("You’ve already claimed today!");
    }

    const newBalance = (user.balance || 0) + 100;

    await supabase
      .from("players")
      .update({ balance: newBalance })
      .eq("id", user.id);

    await supabase
      .from("faucet_claims")
      .insert({ user_id: user.id, claimed_at: new Date().toISOString() });

    setUser({ ...user, balance: newBalance });
    alert("Claimed 100 mito!");
  };

  return (
    <div className="home">
      <div className="content">
        {checkingAuth ? (
          <p>Loading...</p>
        ) : user ? (
          <>
            <HamburgerMenu user={user} open={menuOpen} setOpen={setMenuOpen} />
            <div className="header">
              <span className="rank">#{user.rank || "000"}</span>
              <span className="balance">{user.balance ?? 0} mito</span>
              <button className="faucet-btn" onClick={handleFaucet}>
                Claim Faucet
              </button>
            </div>
            <GameBoard user={user} />
            <DailyStats />
            <Leaderboard />
          </>
        ) : (
          <div className="login">
            <h2>Login to Play</h2>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSignIn} disabled={loading}>
              {loading ? "Sending magic link..." : "Send Magic Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;