import Navigation from "@/components/Navigation";
import bg4 from "@/assets/bg4.png";

const Profile = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg4})` }}
    >
      <Navigation />
      
      <div className="pt-32 px-12">
        <div className="max-w-4xl mx-auto bg-teal-overlay/80 backdrop-blur-md rounded-3xl p-12 text-center">
          <h1 className="text-5xl font-light mb-8 text-accent">Agent Profile</h1>
          <p className="text-xl text-foreground/80">Profile details coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
