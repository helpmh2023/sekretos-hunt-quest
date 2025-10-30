import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bg1 from "@/assets/bg1.webp"; //
import { toast } from "sonner";

// --- FIREBASE IMPORTS ---
import { auth, db } from "../firebase/config"; // Import services
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

const Login = () => {
    const [agentSecret, setAgentSecret] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // 1. Auth State Listener (Client-side Page Protection)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is already signed in, redirect to home
                navigate("/home", { replace: true });
            }
        });
        return unsubscribe; // Cleanup listener on unmount
    }, [navigate]);

    const handleStartHunt = () => {
      navigate("/hunt");
    };

    const handleLogin = async () => {
        if (!agentSecret) {
            toast.error("Login Failed", { description: "Agent Secret cannot be empty." });
            return;
        }

        setIsLoading(true);
        try {
            // 2. Query the 'users' collection to find the profile with this secret
            const q = query(
              collection(db, "users"), 
              where('agentSecret', '==', agentSecret),
              limit(1)
            );
            
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast.error("Login Failed", { description: "Invalid Agent Secret. Access Denied." });
                setIsLoading(false);
                return;
            }

            // 3. Retrieve the hidden email from the user's document
            const userData = querySnapshot.docs[0].data();
            const tempEmail = userData.email;
            
            // 4. Sign in using the hidden email and Agent Secret (as password)
            await signInWithEmailAndPassword(auth, tempEmail, agentSecret);

            // Success is handled by the useEffect listener which navigates to /home
            toast.success(`Welcome, Agent ${userData.agentName}!`);

        } catch (error: any) {
            console.error("Login Error:", error);
            let errorMessage = "Authentication failed. Double-check your secret.";
            if (error.code === 'auth/invalid-credential') {
              errorMessage = "Invalid Agent Secret.";
            }
            toast.error("Login Failed", { description: errorMessage });
        } finally {
            setIsLoading(false);
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
              <p className="text-xl text-foreground/90"></p>
            </div>

            <div className="space-y-6">
              <Input
                type="password"
                placeholder=""
                value={agentSecret}
                onChange={(e) => setAgentSecret(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="h-16 text-2xl text-center bg-transparent border-2 border-primary/50 text-foreground placeholder:text-foreground/60 rounded-2xl"
                disabled={isLoading}
              />

              <Button
                onClick={handleLogin}
                className="w-full h-16 text-2xl font-medium bg-accent hover:bg-accent/80 text-accent-foreground rounded-2xl"
                disabled={isLoading}
              >
                {isLoading ? "AUTHENTICATING..." : "LOGIN"}
              </Button>

              <Button
                variant="outline"
                onClick={handleStartHunt}
                className="w-full h-16 text-2xl font-medium bg-transparent border-2 border-primary/50 text-foreground hover:bg-primary/10 rounded-2xl"
                disabled={isLoading}
              >
                Cryptic Hunt
              </Button>
            </div>
          </div>
        </div>
    );
};

export default Login;