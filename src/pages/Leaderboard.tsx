import Navigation from "@/components/Navigation";

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-dark via-background to-teal-dark">
      <Navigation />
      
      <div className="pt-32 px-12">
        <div className="max-w-4xl mx-auto bg-teal-overlay/80 backdrop-blur-md rounded-3xl p-12 text-center">
          <h1 className="text-5xl font-light mb-8 text-accent">Leaderboard</h1>
          <p className="text-xl text-foreground/80">Rankings coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
