// src/pages/Leaderboard.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import leaderboardBg from "@/assets/leaderboardbg.png";
import logo from "@/assets/logo.png";

// --- Data model for users ---
interface AgentData {
  id: string;
  agentName: string;
  points: number; // used as ELO for now
  rank?: string;
  missionsCompleted?: number;
  createdAt?: Timestamp;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if unauthenticated
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/");
    });

    // Live leaderboard ordered by points (ELO)
    const q = query(collection(db, "users"), orderBy("points", "desc"));
    const dbUnsubscribe = onSnapshot(q, (qs) => {
      const list: AgentData[] = [];
      qs.forEach((d) => list.push({ id: d.id, ...d.data() } as AgentData));
      setAgents(list.slice(0, 10)); // top 10
      setIsLoading(false);
    });

    return () => {
      authUnsubscribe();
      dbUnsubscribe();
    };
  }, [navigate]);

  // Helpers to render with safe fallbacks
  const getRank = (a: AgentData) => a.rank ?? "Sentinel";
  const getMissions = (a: AgentData) => a.missionsCompleted ?? 0;

  // Match logout behavior used across the app
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully.");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-[#C8E6F8]"
      style={{ backgroundImage: `url(${leaderboardBg})` }}
    >
      {/* Top bar to match the mock exactly */}
      <header className="w-full flex items-center justify-between px-6 md:px-10 pt-6">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-12 h-12" alt="Sekretos" />
          <span className="text-2xl font-bold tracking-wide">Sekretos</span>
        </div>

        {/* Center pill nav */}
        <nav className="hidden md:flex items-center gap-8 bg-[#0c2b2e]/75 backdrop-blur-md px-8 py-3 rounded-full border border-[#54d0cf]/30">
          <Link to="/home" className="text-sm md:text-base tracking-wide hover:text-white">HOME</Link>
          <Link to="/feed" className="text-sm md:text-base tracking-wide hover:text-white">FEED</Link>
          <Link to="/missions" className="text-sm md:text-base tracking-wide hover:text-white">MISSIONS</Link>
          <Link to="/milestones" className="text-sm md:text-base tracking-wide hover:text-white">MILESTONES</Link>
          <Link to="/leaderboard" className="text-sm md:text-base tracking-wide text-white">LEADERBOARD</Link>
          <Link to="/profile" className="text-sm md:text-base tracking-wide hover:text-white">PROFILE</Link>
        </nav>

        <Button
          onClick={handleLogout}
          className="bg-accent hover:bg-accent/80 text-accent-foreground px-8 py-6 text-lg font-medium rounded-full"
        >
          LOGOUT
        </Button>
      </header>

      {/* Table container */}
      <main className="px-4 md:px-10 pt-10 md:pt-16 pb-16 flex justify-center">
        <div
          className="w-full max-w-6xl bg-white/5 backdrop-blur-3xl saturate-150 rounded-[28px] border-[5px] border-white/90 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
        >
          {/* Header row */}
          <div className="grid grid-cols-[90px_1fr_140px_160px_220px] items-center px-6 md:px-10 py-4 md:py-5 text-[#9fd8e6] text-base md:text-lg border-b border-[#2cc6c6]/30">
            <div className="text-center">Place</div>
            <div className="">Agentname</div>
            <div className="text-center">Elo</div>
            <div className="text-center">Rank</div>
            <div className="text-center">Missions Completed</div>
          </div>

          {/* Rows */}
          {isLoading ? (
            <div className="py-16 text-center text-[#9fd8e6]">Loading...</div>
          ) : (
            agents.map((a, idx) => (
              <div
                key={a.id}
                className="grid grid-cols-[90px_1fr_140px_160px_220px] items-center px-6 md:px-10 py-4 md:py-5 border-b border-[#2cc6c6]/15 last:border-b-0"
              >
                <div className="text-2xl md:text-3xl font-medium text-[#c7edff] text-center">{idx + 1}</div>
                <div className="text-2xl md:text-3xl font-semibold text-white">{a.agentName}</div>
                <div className="text-2xl md:text-3xl font-semibold text-[#c7edff] text-center">{a.points}</div>
                <div className="text-xl md:text-2xl font-medium text-[#c7edff] text-center">{getRank(a)}</div>
                <div className="text-2xl md:text-3xl font-semibold text-[#c7edff] text-center">{getMissions(a)}</div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard; 