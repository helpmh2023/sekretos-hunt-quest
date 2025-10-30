import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Sekretos Logo" className="w-12 h-12" />
        <span className="text-2xl font-bold text-primary">Sekretos</span>
      </div>
      
      <div className="flex items-center gap-6 bg-teal-overlay/80 backdrop-blur-sm px-8 py-3 rounded-full">
        <Link 
          to="/home" 
          className={`text-lg font-medium transition-colors ${isActive('/home') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
        >
          HOME
        </Link>
        <Link 
          to="/feed" 
          className={`text-lg font-medium transition-colors ${isActive('/feed') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
        >
          FEED
        </Link>
        <Link 
          to="/missions" 
          className={`text-lg font-medium transition-colors ${isActive('/missions') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
        >
          MISSIONS
        </Link>
        <Link 
          to="/milestones" 
          className={`text-lg font-medium transition-colors ${isActive('/milestones') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
        >
          MILESTONES
        </Link>
        <Link 
          to="/leaderboard" 
          className={`text-lg font-medium transition-colors ${isActive('/leaderboard') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
        >
          LEADERBOARD
        </Link>
        <Link 
          to="/profile" 
          className={`text-lg font-medium transition-colors ${isActive('/profile') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
        >
          PROFILE
        </Link>
      </div>

      <Button 
        onClick={handleLogout}
        className="bg-accent hover:bg-accent/80 text-accent-foreground px-8 py-6 text-lg font-medium rounded-full"
      >
        LOGOUT
      </Button>
    </nav>
  );
};

export default Navigation;
