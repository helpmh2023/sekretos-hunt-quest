// src/pages/Feed.tsx

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bg3 from "@/assets/bg3.webp"; //
import { toast } from "sonner";
import { auth, db } from "../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";

// --- Define the Message data structure ---
interface Message {
  id: string;
  content: string;
  agentName: string;
  senderId: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

// --- Component for the Countdown Timer ---
const MessageTimer = ({ expiresAt }: { expiresAt: Timestamp }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const expiryTime = expiresAt.toMillis();
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        setTimeLeft("00:00");
        return;
      }

      const minutes = Math.floor((remaining / 1000 / 60) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      setTimeLeft(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    calculateTimeLeft(); // Run immediately
    const interval = setInterval(calculateTimeLeft, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [expiresAt]);

  return (
    <span className="text-xs font-mono text-foreground/60 ml-4">
      {timeLeft}
    </span>
  );
};

// --- Component for a Single Message ---
const MessageItem = ({ message }: { message: Message }) => {
  const isSender = message.senderId === auth.currentUser?.uid;

  return (
    <div
      className={`p-4 rounded-lg flex flex-col data-[state=new]:animate-in data-[state=new]:fade-in data-[state=new]:slide-in-from-bottom-5 ${
        isSender ? "bg-primary/90 self-end" : "bg-muted/80 self-start"
      }`}
      data-state="new" // For animation
    >
      <div className="flex justify-between items-center mb-1">
        <span className={`font-bold ${isSender ? "text-primary-foreground" : "text-accent"}`}>
          {message.agentName}
        </span>
        <MessageTimer expiresAt={message.expiresAt} />
      </div>
      <p className={`text-lg ${isSender ? "text-primary-foreground/90" : "text-foreground"}`}>
        {message.content}
      </p>
    </div>
  );
};

// --- Main Feed Page Component ---
const Feed = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAgentName, setCurrentAgentName] = useState<string | null>(null);

  // 1. Fetch the current user's Agent Name on load
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentAgentName(userDoc.data().agentName);
        } else {
          toast.error("Error", { description: "Could not find your Agent profile." });
        }
      }
    };
    fetchUserData();
  }, []);

  // 2. Listen for real-time messages
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        // Only add messages that haven't expired
        const data = doc.data() as Omit<Message, 'id'>;
        if (data.expiresAt.toMillis() > Date.now()) {
          msgs.push({ ...data, id: doc.id });
        }
      });
      setMessages(msgs);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // 3. Handle sending a new message
  const handleTransmit = async () => {
    if (!message.trim()) return;
    if (!currentAgentName || !auth.currentUser) {
      toast.error("Transmission Failed", { description: "Agent profile not found." });
      return;
    }

    setIsLoading(true);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now

    try {
      await addDoc(collection(db, "messages"), {
        content: message,
        agentName: currentAgentName,
        senderId: auth.currentUser.uid,
        createdAt: Timestamp.fromDate(now),
        expiresAt: Timestamp.fromDate(expiresAt), // This is the key for the timer and TTL
      });
      setMessage("");
    } catch (error) {
      console.error("Message send error:", error);
      toast.error("Transmission Failed", { description: "Could not send message." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg3})` }}
    >
      <Navigation />
      
      <div className="pt-32 px-12">
        <div className="max-w-6xl mx-auto">
          {/* Message Display Area */}
          <div className="bg-primary/80 backdrop-blur-md rounded-3xl p-8 min-h-[500px] flex flex-col gap-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-4xl font-light mb-4 text-foreground uppercase tracking-wide">
                  NO ACTIVE TRANSMISSIONS
                </h2>
                <p className="text-xl text-foreground/80">
                  Waiting for incoming messages...
                </p>
              </div>
            ) : (
              messages.map((msg) => <MessageItem key={msg.id} message={msg} />)
            )}
          </div>

          {/* Input Area */}
          <div className="mt-8 flex gap-4">
            <Input
              type="text"
              placeholder="Type encrypted message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTransmit()}
              className="flex-1 h-16 text-xl bg-muted/80 backdrop-blur-sm border-2 border-primary/30 text-foreground placeholder:text-foreground/50 rounded-2xl px-8"
              disabled={isLoading}
            />
            <Button
              onClick={handleTransmit}
              className="bg-accent hover:bg-accent/80 text-accent-foreground px-16 h-16 text-xl font-medium rounded-2xl"
              disabled={isLoading}
            >
              {isLoading ? "SENDING..." : "Transmit"}
            </Button>
          </div>

          <p className="text-center mt-6 text-foreground/70 text-sm">
            Messages are purged every 5 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feed;