import Navigation from "@/components/Navigation";
import bg2 from "@/assets/bg2.webp";

const Home = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg2})` }}
    >
      <Navigation />
      
      <div className="pt-32 px-12">
        <div className="flex justify-between items-start gap-8">
          {/* Left Section - Ranks */}
          <div className="bg-teal-overlay/80 backdrop-blur-md rounded-3xl p-12 w-[500px]">
            <h2 className="text-3xl font-medium mb-8 text-accent uppercase">
              Gain ELO and Climb<br />Up the Ranks
            </h2>
            
            <div className="space-y-6 text-foreground">
              <div>
                <h3 className="text-3xl font-bold mb-1">INITIATE</h3>
                <p className="text-lg">0-100</p>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold mb-1">OPERATIVE</h3>
                <p className="text-lg">100-500</p>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold mb-1">AGENT</h3>
                <p className="text-lg">500-1000</p>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold mb-1">SENTINEL</h3>
                <p className="text-lg">1000+</p>
              </div>
            </div>
          </div>

          {/* Center Section - Welcome */}
          <div className="flex-1 text-center">
            <p className="text-2xl mb-6 text-foreground/80">WELCOME TO</p>
            <h1 className="text-[140px] font-light leading-none text-accent tracking-wide">
              SEKRETOS
            </h1>
          </div>

          {/* Right Section - Milestones */}
          <div className="bg-accent/90 backdrop-blur-md rounded-3xl p-12 w-[500px]">
            <h2 className="text-4xl font-bold mb-6 text-accent-foreground">
              COMPLETE<br />MILESTONES<br />AND EARN<br />REWARDS
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
