import Navigation from "@/components/Navigation";
import logo from "@/assets/logo.png";

const Milestones = () => {
  const milestones = [
    { elo: "+100", title: "The First Blood", description: "initiation of the first successful operation." },
    { elo: "+150", title: "Eyes Open", description: "establishing awareness and observation network." },
    { elo: "+200", title: "Whispers Heard", description: "decoding and exchanging the first message." },
    { elo: "+400", title: "The Silent Handshake", description: "linking two Sekretos cells without public trace." },
    { elo: "+500", title: "Under the Rose", description: "executing a covert task that remains unspoken." },
    { elo: "+500", title: "Echo of Sekretos", description: "imprinting the movement's unseen presence across channels." },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-32 px-12">
        <div className="max-w-6xl mx-auto bg-teal-overlay/80 backdrop-blur-md rounded-3xl p-12 relative overflow-hidden">
          {/* Background Logo with teal background */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
          >
            <div 
              className="w-[60%] h-[60%] flex items-center justify-center bg-teal-medium/30 rounded-full"
              style={{
                backgroundImage: `url(${logo})`,
                backgroundSize: '80%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-[300px_1fr] gap-12">
            {/* Left - ELO Points */}
            <div className="space-y-8">
              <h2 className="text-3xl font-medium mb-8 text-accent">Elo gained</h2>
              {milestones.map((milestone, index) => (
                <div key={index} className="text-5xl font-light text-accent">
                  {milestone.elo}
                </div>
              ))}
            </div>

            {/* Right - Milestone Details */}
            <div className="space-y-8 border-l-2 border-foreground/30 pl-12">
              <h2 className="text-3xl font-medium mb-8 text-accent">The milestone</h2>
              {milestones.map((milestone, index) => (
                <div key={index} className="text-foreground">
                  <h3 className="text-2xl font-medium mb-2">{milestone.title}</h3>
                  <p className="text-lg opacity-90">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Milestones;
