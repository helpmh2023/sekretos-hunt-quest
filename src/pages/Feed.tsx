import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bg3 from "@/assets/bg3.webp";

const Feed = () => {
  const [message, setMessage] = useState("");

  const handleTransmit = () => {
    // Handle message transmission
    console.log("Transmitting:", message);
    setMessage("");
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg3})` }}
    >
      <Navigation />
      
      <div className="pt-32 px-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-primary/80 backdrop-blur-md rounded-3xl p-16 min-h-[500px] flex flex-col items-center justify-center">
            <h2 className="text-4xl font-light mb-4 text-foreground uppercase tracking-wide">
              NO ACTIVE TRANSMISSIONS
            </h2>
            <p className="text-xl text-foreground/80 mb-12">
              Waiting for incoming messages...
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Input
              type="text"
              placeholder="Type encrypted message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 h-16 text-xl bg-muted/80 backdrop-blur-sm border-2 border-primary/30 text-foreground placeholder:text-foreground/50 rounded-2xl px-8"
            />
            <Button
              onClick={handleTransmit}
              className="bg-accent hover:bg-accent/80 text-accent-foreground px-16 h-16 text-xl font-medium rounded-2xl"
            >
              Transmit
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
