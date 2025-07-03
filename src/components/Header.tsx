import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Calendar, LogOut, Volume2, VolumeX, Rocket } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { signOut, getUserDisplayName } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('alien-sound-enabled') === 'true';
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Safe travels, Space Explorer!",
        description: "You have successfully logged out of your galactic account",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('alien-sound-enabled', newState.toString());
    
    toast({
      title: newState ? "Alien Sound Effects Enabled" : "Sound Effects Disabled",
      description: newState 
        ? "Welcome to the cosmic soundscape! 🛸" 
        : "Silent space mode activated 🔇",
      duration: 2000,
    });

    if (newState) {
      playAlienSound();
    }
  };

  const playAlienSound = () => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Alien-like sound effect
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const displayName = getUserDisplayName(user);

  return (
    <>
      <div className="alien-starfield"></div>
      <header className="relative z-50 bg-background/95 backdrop-blur-md border-b border-border sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="text-3xl">🛸</div>
              <div className="flex flex-col">
                <div className="text-2xl md:text-3xl font-alien font-bold glow-text-purple">
                  AlienAirbnb
                </div>
                <div className="text-xs text-accent font-space">
                  Intergalactic Inc.
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`text-lg font-space transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary glow-text-purple' : 'text-foreground'
                }`}
              >
                Home
              </Link>
              
              <Link 
                to="/" 
                className="text-lg font-space transition-colors hover:text-accent text-foreground"
              >
                Destinations
              </Link>

              <Link 
                to="/" 
                className="text-lg font-space transition-colors hover:text-alien-green text-foreground"
              >
                Guest Favourites
              </Link>
              
              {user && (
                <Link 
                  to="/bookings" 
                  className={`text-lg font-space transition-colors hover:text-accent ${
                    isActive('/bookings') ? 'text-accent glow-text-blue' : 'text-foreground'
                  }`}
                >
                  My Bookings
                </Link>
              )}

              {/* Book Now Button */}
              <Button
                onClick={() => navigate('/')}
                className="alien-button bg-primary hover:bg-primary/90 text-primary-foreground font-space font-semibold px-6"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Book Now
              </Button>

              {/* Sound Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSound}
                className="text-muted-foreground hover:text-primary"
                aria-label={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              {/* Auth Section */}
              {loading ? (
                <div className="ufo-loader scale-50" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="alien-button-blue border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Space Explorer {displayName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookings" className="cursor-pointer">
                        <Calendar className="w-4 h-4 mr-2" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  className="alien-button border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => navigate('/auth')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground hover:text-primary"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={`text-lg font-space transition-colors hover:text-primary ${
                    isActive('/') ? 'text-primary glow-text-purple' : 'text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                
                <Link 
                  to="/" 
                  className="text-lg font-space transition-colors hover:text-accent text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Destinations
                </Link>

                <Link 
                  to="/" 
                  className="text-lg font-space transition-colors hover:text-alien-green text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Guest Favourites
                </Link>
                
                {user && (
                  <Link 
                    to="/bookings" 
                    className={`text-lg font-space transition-colors hover:text-accent ${
                      isActive('/bookings') ? 'text-accent glow-text-blue' : 'text-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    My Bookings
                  </Link>
                )}

                {/* Mobile Book Now */}
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/');
                  }}
                  className="alien-button bg-primary hover:bg-primary/90 text-primary-foreground font-space font-semibold w-fit"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Book Now
                </Button>

                {/* Mobile Sound Toggle */}
                <Button
                  variant="ghost"
                  onClick={toggleSound}
                  className="justify-start text-muted-foreground hover:text-primary w-fit"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                  {soundEnabled ? 'Disable Sound' : 'Enable Sound'}
                </Button>

                {/* Mobile Auth */}
                {loading ? (
                  <div className="ufo-loader scale-50" />
                ) : user ? (
                  <div className="flex flex-col space-y-2">
                    <div className="text-accent font-space">
                      Welcome, Space Explorer {displayName}
                    </div>
                    <Link 
                      to="/profile" 
                      className="text-foreground hover:text-primary font-space"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Profile
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="justify-start text-red-400 hover:text-red-300 w-fit"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="alien-button border-primary text-primary hover:bg-primary hover:text-primary-foreground w-fit"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/auth');
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;