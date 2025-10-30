import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // For the Secret Popup
import bg1 from "@/assets/bg1.webp"; //
import { toast } from "sonner";
// --- FIREBASE IMPORTS ---
import { auth, db, getAgentEmail } from "../firebase/config"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, runTransaction, doc, serverTimestamp, limit, setDoc } from "firebase/firestore"; // <-- FIX IS HERE

// --- 1. Cryptic Problems Data ---
const CRYPTIC_PROBLEMS = [
  { id: 1, riddle: "I have hands but no arms or legs.", answer: "CLOCK" },
  { id: 2, riddle: "The more you take, the more you leave behind.", answer: "FOOTSTEPS" },
  { id: 3, riddle: "I go up but never come down.", answer: "AGE" },
  { id: 4, riddle: "What has a head and a tail but no body?", answer: "COIN" },
  { id: 5, riddle: "I’m full of holes but still hold water.", answer: "SPONGE" },
  { id: 6, riddle: "What has one eye but can’t see?", answer: "NEEDLE" },
  { id: 7, riddle: "What gets wetter the more it dries?", answer: "TOWEL" },
  { id: 8, riddle: "What has keys but can’t open locks?", answer: "PIANO" },
  { id: 9, riddle: "What runs but never walks?", answer: "WATER" },
  { id: 10, riddle: "What can travel around the world while staying in a corner?", answer: "STAMP" },
];

const CrypticHunt = () => {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSecret, setShowSecret] = useState(false); // State for the popup
  const [assignedAgent, setAssignedAgent] = useState({ name: '', secret: '' });
  const navigate = useNavigate();

  const selectedProblem = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * CRYPTIC_PROBLEMS.length);
    return CRYPTIC_PROBLEMS[randomIndex];
  }, []);

  const handleProceedToLogin = () => {
    navigate("/", { replace: true });
  }

  const handleSubmit = async () => {
    if (isLoading || isComplete) return;

    const normalizedAnswer = answer.toUpperCase().replace(/\s/g, '');
    const correctSolution = selectedProblem.answer.toUpperCase();

    if (normalizedAnswer !== correctSolution) {
      toast.error("Access Denied", { description: "The decryption key is incorrect. Try again." });
      setAnswer("");
      return;
    }

    // --- Answer is Correct: Start Agent Registration Transaction ---
    setIsLoading(true);
    toast.info("Solution Accepted", { description: "Securing Agent Credentials..." });

    try {
      // 1. Find the first unassigned secret (BEFORE the transaction)
      const secretsQuery = query(
        collection(db, "secrets"),
        where("isAssigned", "==", false),
        limit(1)
      );

      const snapshot = await getDocs(secretsQuery);

      if (snapshot.empty) {
        throw new Error("No unassigned secrets available.");
      }

      const secretDoc = snapshot.docs[0];
      const secretData = secretDoc.data();
      const agentName = secretData.agentName;
      const agentSecret = secretData.agentSecret;
      const tempEmail = getAgentEmail(agentName);

      // 2. Now use transaction to claim it atomically
      const agentData = await runTransaction(db, async (transaction) => {
        // Re-read the document inside the transaction to ensure it's still available
        const freshSecretDoc = await transaction.get(secretDoc.ref);
        
        if (!freshSecretDoc.exists()) {
          throw new Error("Secret document no longer exists.");
        }

        const freshData = freshSecretDoc.data();
        if (freshData.isAssigned === true) {
          throw new Error("This secret was just assigned to another user. Please try again.");
        }

        // Claim the secret
        transaction.update(secretDoc.ref, {
          isAssigned: true,
          assignedAt: serverTimestamp(),
          assignedToUID: "PENDING_AUTH",
        });

        return { name: agentName, secret: agentSecret, email: tempEmail, docRef: secretDoc.ref };
      });
      
      // 3. Create User in Firebase Auth (outside the transaction)
      const userCredential = await createUserWithEmailAndPassword(auth, agentData.email, agentData.secret);
      const user = userCredential.user;

      // 4. Create User Profile in the 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        agentName: agentData.name,
        agentSecret: agentData.secret, // Stored here for login lookup
        email: agentData.email, // Stored here for Auth sign-in
        points: 100, // Initial points for solving the hunt
        rank: "INITIATE",
        createdAt: serverTimestamp(),
      });

      // 5. Finalize the 'secrets' document with the real UID
      await setDoc(agentData.docRef, { 
          assignedToUID: user.uid,
       }, { merge: true }); // merge:true only updates this one field

      // 6. Show success and the One-Time Secret in the popup
      setAssignedAgent({ name: agentData.name, secret: agentData.secret });
      setIsComplete(true);
      setShowSecret(true);

    } catch (error: any) {
      setIsLoading(false);
      let errorMessage = "System failure during registration.";
      if (error.message.includes("unassigned secrets")) {
        errorMessage = "Error: All Agent Secrets are assigned. Contact HQ.";
      } else if (error.code === 'auth/email-already-in-use') {
         errorMessage = "Agent ID conflict. Please contact HQ.";
      }
      console.error("Agent Registration Error:", error);
      toast.error("Registration Error", { description: errorMessage });
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center p-8"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <div className="w-full max-w-2xl mx-auto p-8 bg-teal-overlay/80 backdrop-blur-md rounded-3xl border-2 border-primary/30">
          
          <div className="flex justify-start items-center mb-4">
            <h2 className="text-2xl font-medium text-foreground/90">Problem</h2>
          </div>
          
          <div className="h-px bg-primary/30 mb-6"></div>

          <div className="text-center mb-8">
            <p className="text-lg text-foreground/70 tracking-widest">[Difficulty: Easy]</p>
            <h1 className="text-4xl font-bold text-accent my-2">CRYPTIC HUNT</h1>
            <p className="text-lg text-foreground/70">Solve the puzzle to gain entry.</p>
          </div>

          <div className="bg-black/30 border border-primary/30 rounded-lg p-6 mb-6 min-h-[150px] flex items-center">
            <span className="text-2xl font-medium text-foreground/70 w-32">PUZZLE:</span>
            <p className="text-3xl font-light text-primary flex-1">
              {selectedProblem.riddle}
            </p>
          </div>

          <div className="mb-6">
            <Input
              type="text"
              placeholder="Enter answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="h-16 text-2xl text-left bg-transparent border-2 border-primary/50 text-foreground placeholder:text-foreground/60 rounded-xl px-6"
              disabled={isLoading || isComplete}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full h-16 text-2xl font-medium bg-accent hover:bg-accent/80 text-accent-foreground rounded-xl"
            disabled={isLoading || isComplete}
          >
            {isLoading ? "ASSIGNING AGENT ID..." : (isComplete ? "SUCCESS" : "SUBMIT")}
          </Button>

          <p className="text-center text-sm text-foreground/60 mt-6">
            Note: All answers are single words. Case and spaces do not matter.
          </p>

          <Button
              variant="link"
              className="w-full mt-4 text-foreground/70 hover:text-foreground"
              onClick={() => navigate("/")}
              disabled={isLoading || isComplete}
          >
              Return to Login
          </Button>

        </div>
      </div>
      
      {/* --- One-Time Secret Popup --- */}
      <Dialog open={showSecret}>
        <DialogContent className="sm:max-w-[425px] bg-teal-overlay/95 border-primary/50">
          <DialogHeader>
            <DialogTitle className="text-3xl text-accent">ACCESS GRANTED</DialogTitle>
            <DialogDescription className="text-lg text-foreground/80 mt-2">
              Your Agent Credentials have been assigned. This is a one-time display.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="text-center bg-card p-4 rounded-lg border border-primary/50">
              <p className="text-xl text-foreground">Agent Name:</p>
              <p className="text-3xl font-bold text-accent">{assignedAgent.name}</p>
            </div>
            <div className="text-center bg-card p-4 rounded-lg border border-primary/50">
              <p className="text-xl text-foreground">Agent Secret:</p>
              <p className="text-3xl font-bold text-accent">{assignedAgent.secret}</p>
            </div>
          </div>
          <p className="text-sm text-red-400 text-center font-medium">
            !! WRITE THIS SECRET DOWN NOW. IT IS YOUR ONLY KEY TO LOGIN. !!
          </p>
          <Button 
            onClick={handleProceedToLogin}
            className="w-full h-12 text-lg font-medium bg-accent hover:bg-accent/80 text-accent-foreground rounded-xl mt-4"
          >
            Proceed to Login
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CrypticHunt;