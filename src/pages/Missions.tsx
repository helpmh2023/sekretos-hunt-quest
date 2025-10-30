import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import bg3 from "@/assets/bg3.webp";

const Missions = () => {
  const missions = [
    {
      difficulty: "EASY",
      title: "Decode the First Message",
      description: "Uncover the hidden meaning in the cryptic transmission",
      reward: "+100",
    },
    {
      difficulty: "MEDIUM",
      title: "Infiltrate the Network",
      description: "Establish secure connection to the inner circle",
      reward: "+250",
    },
    {
      difficulty: "EASY",
      title: "Gather Intelligence",
      description: "Collect data from three different sources",
      reward: "+150",
    },
    {
      difficulty: "EASY",
      title: "Project Whisperlink",
      description: "Use and verify coded phrases to confirm awareness.",
      reward: "+100",
    },
    {
      difficulty: "MEDIUM",
      title: "Operation Veilmarch",
      description: "Discreetly place the symbol in public.",
      reward: "+250",
    },
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${bg3})`,
        backgroundSize: 'cover',
      }}
    >
      {/* Dot pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      
      <Navigation />
      
      <div className="relative z-10 pt-32 px-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
          <div className="bg-teal-overlay/80 backdrop-blur-md rounded-2xl p-8 text-center border-2 border-primary/30">
            <div className="text-sm mb-2 text-foreground/80 uppercase tracking-wider">Total</div>
            <div className="text-6xl font-light text-accent">6</div>
          </div>
          
          <div className="bg-teal-overlay/80 backdrop-blur-md rounded-2xl p-8 text-center border-2 border-primary/30">
            <div className="text-sm mb-2 text-foreground/80 uppercase tracking-wider">Completed</div>
            <div className="text-6xl font-light text-accent">0</div>
          </div>
          
          <div className="bg-teal-overlay/80 backdrop-blur-md rounded-2xl p-8 text-center border-2 border-primary/30">
            <div className="text-sm mb-2 text-foreground/80 uppercase tracking-wider">Active</div>
            <div className="text-6xl font-light text-accent">6</div>
          </div>
          
          <div className="bg-teal-overlay/80 backdrop-blur-md rounded-2xl p-8 text-center border-2 border-primary/30">
            <div className="text-sm mb-2 text-foreground/80 uppercase tracking-wider">Completion</div>
            <div className="text-6xl font-light text-accent">0%</div>
          </div>
        </div>

        {/* Mission List */}
        <div className="space-y-4 max-w-6xl mx-auto">
          {missions.map((mission, index) => (
            <div 
              key={index}
              className="bg-accent/90 backdrop-blur-sm rounded-2xl p-8 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="text-sm mb-2 text-primary font-medium">{mission.difficulty === "EASY" ? "Decode [EASY]" : "Infiltrate [MEDIUM]"}</div>
                <h3 className="text-2xl font-medium mb-2 text-accent-foreground">{mission.title}</h3>
                <p className="text-accent-foreground/90">{mission.description}</p>
                <p className="text-accent-foreground/80 mt-2">Reward:{mission.reward}</p>
              </div>
              
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground px-12 py-6 text-xl font-medium rounded-xl">
                COMPLETE
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Missions;
