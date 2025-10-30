// src/pages/Profile.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Progress } from "@/components/ui/progress"; //
import { toast } from "sonner";
import { auth, db } from "../firebase/config"; //
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, Timestamp, collection, query, where, getDocs } from "firebase/firestore";

// --- FIX: Import your new background image ---
// (Make sure 'profilebg.png' is in your 'src/assets/' folder)
import profileBg from "@/assets/profilebg.png"; 

// --- Define the User data structure ---
interface AgentProfile {
  agentName: string;
  rank: string;
  points: number;
  createdAt: Timestamp;
  completedMissions?: string[]; // To track completed missions
}

// --- Define Rank structure for progress ---
const RANKS = {
  INITIATE: { min: 0, max: 100, next: "OPERATIVE" },
  OPERATIVE: { min: 100, max: 500, next: "AGENT" },
  AGENT: { min: 500, max: 1000, next: "SENTINEL" },
  SENTINEL: { min: 1000, max: 9999, next: null },
};

type RankName = keyof typeof RANKS;

const Profile = () => {
  const navigate = useNavigate();
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [stats, setStats] = useState({ missions: 0, transmissions: 0 });
  const [progress, setProgress] = useState(0);
  const [eloToNext, setEloToNext] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // --- 1. Fetch User Profile ---
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as AgentProfile;
            setAgent(userData);

            // --- 2. Calculate ELO Progress ---
            const currentRank = userData.rank.toUpperCase() as RankName;
            if (RANKS[currentRank] && RANKS[currentRank].next) {
              const rankData = RANKS[currentRank];
              const pointsInRank = userData.points - rankData.min;
              const rankRange = rankData.max - rankData.min;
              setProgress((pointsInRank / rankRange) * 100);
              setEloToNext(rankData.max - userData.points);
            } else {
              // User is max rank (SENTINEL)
              setProgress(100);
              setEloToNext(0);
            }

            // --- 3. Fetch Mission/Transmission Stats ---
            // Get transmission count
            const transmissionsQuery = query(
              collection(db, "messages"),
              where("senderId", "==", user.uid)
            );
            const transSnapshot = await getDocs(transmissionsQuery);
            
            // Get missions count from the user's profile
            const missionsCount = userData.completedMissions ? userData.completedMissions.length : 0;
            
            setStats({ missions: missionsCount, transmissions: transSnapshot.size });
            setIsLoading(false);

          } else {
            toast.error("Error", { description: "Agent profile not found." });
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Error", { description: "Could not load profile." });
          navigate("/");
        }
      } else {
        // No user logged in
        navigate("/");
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [navigate]);

  // Helper to format the Firestore Timestamp
  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return "...";
    return timestamp.toDate().toLocaleString("en-GB", {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  if (isLoading || !agent) {
    // Loading state
    return (
      <div 
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${profileBg})` }}
      >
        {/* You can add a loading spinner here if you want */}
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${profileBg})` }}
    >
      <Navigation />
      
      <div className="pt-32 px-12">
        <div className="max-w-6xl mx-auto bg-teal-overlay/90 backdrop-blur-md rounded-3xl p-12 relative overflow-hidden border-2 border-primary/30">

          {/* Top Section: Agent Info */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-6xl font-bold text-accent">{agent.agentName}</h1>
              <p className="text-3xl font-light text-foreground/90 mt-2">{agent.rank}</p>
            </div>
            <div className="text-right">
              <p className="text-lg text-foreground/70">AGENT SINCE</p>
              <p className="text-2xl font-medium text-foreground">{formatDate(agent.createdAt)}</p>
            </div>
          </div>

          {/* ELO Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-2">
              <span className="text-lg font-medium text-foreground">ELO Progress</span>
              <span className="text-lg text-accent">{eloToNext > 0 ? `${eloToNext} ELO to ${RANKS[agent.rank.toUpperCase() as RankName]?.next}` : "MAX RANK"}</span>
            </div>
            <Progress value={progress} className="h-4 bg-black/30 border border-primary/50" />
          </div>

          {/* Bottom Section: Stats Grid */}
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-card/80 p-6 rounded-2xl text-center border border-primary/30">
              <p className="text-xl font-medium text-foreground/70 mb-2">TOTAL ELO</p>
              <p className="text-7xl font-light text-accent">{agent.points}</p>
            </div>
            <div className="bg-card/80 p-6 rounded-2xl text-center border border-primary/30">
              <p className="text-xl font-medium text-foreground/70 mb-2">MISSIONS COMPLETED</p>
              <p className="text-7xl font-light text-accent">{stats.missions}</p>
            </div>
            <div className="bg-card/80 p-6 rounded-2xl text-center border border-primary/30">
              {/* --- FIX: Changed text to match your design --- */}
              <p className="text-xl font-medium text-foreground/70 mb-2">MESSAGES TRANSMITTED</p>
              <p className="text-7xl font-light text-accent">{stats.transmissions}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;