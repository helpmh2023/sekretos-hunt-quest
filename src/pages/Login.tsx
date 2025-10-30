import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bg1 from "@/assets/bg1.webp";

const Login = () => {
  const [secretPhrase, setSecretPhrase] = useState("");
  const navigate = useNavigate();

  // This will eventually contain Firebase login logic
  const handleLogin = () => {
    if (secretPhrase) {
      // TEMP: For now, if any secret is entered, go home.
      // We will replace this with Firebase Auth logic later.
      navigate("/home");
    }
  };

  // --- NEW HANDLER for Cryptic Hunt button ---
  const handleStartHunt = () => {
    navigate("/hunt");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg1})` }}
    >
      <div className="w-full max-w-2xl mx-auto p-12 bg-teal-overlay/80 backdrop-blur-md rounded-3xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light mb-4 text-foreground">Welcome to Sekretos</h1>
          <p className="text-xl text-foreground/90">Please enter your secret phrase</p>
        </div>

        <div className="space-y-6">
          <Input
            type="password"
            placeholder=""
            value={secretPhrase}
            onChange={(e) => setSecretPhrase(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="h-16 text-2xl text-center bg-transparent border-2 border-primary/50 text-foreground placeholder:text-foreground/60 rounded-2xl"
          />

          <Button
            onClick={handleLogin}
            className="w-full h-16 text-2xl font-medium bg-accent hover:bg-accent/80 text-accent-foreground rounded-2xl"
          >
            Login
          </Button>

          {/* --- FIX APPLIED HERE --- */}
          <Button
            variant="outline"
            onClick={handleStartHunt} // <-- NOW CALLS THE NAVIGATE FUNCTION
            className="w-full h-16 text-2xl font-medium bg-transparent border-2 border-primary/50 text-foreground hover:bg-primary/10 rounded-2xl"
          >
            Cryptic Hunt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;