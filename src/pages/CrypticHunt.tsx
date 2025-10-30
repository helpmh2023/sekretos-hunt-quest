import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bg1 from "@/assets/bg1.webp";
import { toast } from "sonner";

// --- 1. Cryptic Problems Data ---
const CRYPTIC_PROBLEMS = [
  {
    id: 1,
    riddle: "I have hands but no arms or legs.",
    answer: "CLOCK",
  },
  {
    id: 2,
    riddle: "The more you take, the more you leave behind.",
    answer: "FOOTSTEPS",
  },
  {
    id: 3,
    riddle: "I go up but never come down.",
    answer: "AGE",
  },
  {
    id: 4,
    riddle: "What has a head and a tail but no body?",
    answer: "COIN",
  },
  {
    id: 5,
    riddle: "I’m full of holes but still hold water.",
    answer: "SPONGE",
  },
  {
    id: 6,
    riddle: "What has one eye but can’t see?",
    answer: "NEEDLE",
  },
  {
    id: 7,
    riddle: "What gets wetter the more it dries?",
    answer: "TOWEL",
  },
  {
    id: 8,
    riddle: "What has keys but can’t open locks?",
    answer: "PIANO",
  },
  {
    id: 9,
    riddle: "What runs but never walks?",
    answer: "WATER",
  },
  {
    id: 10,
    riddle: "What can travel around the world while staying in a corner?",
    answer: "STAMP",
  },
];

const CrypticHunt = () => {
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);

  const selectedProblem = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * CRYPTIC_PROBLEMS.length);
    return CRYPTIC_PROBLEMS[randomIndex];
  }, []);

  const handleSubmit = () => {
    if (isComplete) return;

    const normalizedAnswer = answer.toUpperCase().replace(/\s/g, '');
    const correctSolution = selectedProblem.answer.toUpperCase();

    if (normalizedAnswer === correctSolution) {
      toast.success("Access Granted", {
        description: "Your decryption is correct. Stand by for agent creation...",
      });
      setIsComplete(true);
      // We will add Firebase logic here next
    } else {
      toast.error("Access Denied", {
        description: "The decryption key is incorrect. Try again.",
      });
      setAnswer("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${bg1})` }}
    >
      <div className="w-full max-w-2xl mx-auto p-8 bg-teal-overlay/80 backdrop-blur-md rounded-3xl border-2 border-primary/30">
        
        {/* Header - ONLY SHOWS "Problem" */}
        <div className="flex justify-start items-center mb-4">
          <h2 className="text-2xl font-medium text-foreground/90">Problem</h2>
          {/* REMOVED: <span className="text-2xl font-medium text-foreground/90">{selectedProblem.id}/10</span> */}
        </div>
        
        <div className="h-px bg-primary/30 mb-6"></div>

        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-lg text-foreground/70 tracking-widest">[Difficulty: Easy]</p>
          <h1 className="text-4xl font-bold text-accent my-2">CRYPTIC HUNT</h1>
          <p className="text-lg text-foreground/70">Solve the puzzle to gain entry.</p>
        </div>

        {/* Puzzle Box */}
        <div className="bg-black/30 border border-primary/30 rounded-lg p-6 mb-6 min-h-[150px] flex items-center">
          <span className="text-2xl font-medium text-foreground/70 w-32">PUZZLE:</span>
          <p className="text-3xl font-light text-primary flex-1">
            {selectedProblem.riddle}
          </p>
        </div>

        {/* Answer Input */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Enter answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="h-16 text-2xl text-left bg-transparent border-2 border-primary/50 text-foreground placeholder:text-foreground/60 rounded-xl px-6"
            disabled={isComplete}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full h-16 text-2xl font-medium bg-accent hover:bg-accent/80 text-accent-foreground rounded-xl"
          disabled={isComplete}
        >
          {isComplete ? "SUCCESS" : "SUBMIT"}
        </Button>

        {/* Status Message Display */}
        {/* ... (Status message logic remains here for future Firebase integration) ... */}

        <p className="text-center text-sm text-foreground/60 mt-6">
          Note: All answers are single words. Case and spaces do not matter.
        </p>

         <Button
            variant="link"
            className="w-full mt-4 text-foreground/70 hover:text-foreground"
            onClick={() => navigate("/")}
            disabled={isComplete}
        >
            Return to Login
        </Button>

      </div>
    </div>
  );
};

export default CrypticHunt;