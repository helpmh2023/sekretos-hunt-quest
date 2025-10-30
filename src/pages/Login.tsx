import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bg1 from "@/assets/bg1.webp";

const Login = () => {
  const [agentId, setAgentId] = useState("");
  const [secretPhrase, setSecretPhrase] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple validation - in production, you'd verify credentials
    if (agentId && secretPhrase) {
      navigate("/home");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg1})` }}
    >
      <div className="w-full max-w-2xl mx-auto p-12 bg-teal-overlay/80 backdrop-blur-md rounded-3xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light mb-4 text-foreground">Welcome to Sekretos</h1>
          <p className="text-xl text-foreground/90">Enter secret phrase and agent id to access the website</p>
        </div>

        <div className="space-y-6">
          <Input
            type="text"
            placeholder="Enter Agent ID"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="h-16 text-2xl text-center bg-transparent border-2 border-primary/50 text-foreground placeholder:text-foreground/60 rounded-2xl"
          />
          
          <Input
            type="password"
            placeholder="Enter Secret Phrase"
            value={secretPhrase}
            onChange={(e) => setSecretPhrase(e.target.value)}
            className="h-16 text-2xl text-center bg-transparent border-2 border-primary/50 text-foreground placeholder:text-foreground/60 rounded-2xl"
          />

          <p className="text-center text-foreground/80 text-sm">
            Not registered yet? Apply to the club.
          </p>

          <Button
            onClick={handleLogin}
            className="w-full h-16 text-2xl font-medium bg-accent hover:bg-accent/80 text-accent-foreground rounded-2xl"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
