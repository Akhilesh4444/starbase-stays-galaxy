import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Calendar, Save, Zap } from 'lucide-react';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { getUserDisplayName } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      setDisplayName(getUserDisplayName(user));
      setEmail(user.email || '');
    }
  }, [user, loading, navigate]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    
    // Simulate profile update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Profile Updated! 🛸",
      description: "Your galactic profile has been successfully updated.",
    });
    
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Loading cosmic profile..." size="lg" />
        </main>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  const joinDate = new Date(user.created_at).toLocaleDateString();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-alien font-bold mb-2">
              <span className="text-accent glow-text-blue">SPACE</span>{' '}
              <span className="text-primary glow-text-purple">EXPLORER</span>{' '}
              <span className="text-alien-green glow-text-green">PROFILE</span>
            </h1>
            <p className="text-muted-foreground font-space">
              Manage your galactic travel profile and cosmic preferences 🌌
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Overview */}
            <Card className="alien-hover-lift bg-card/95 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-space">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="font-space text-foreground">
                      Space Explorer {displayName} 🚀
                    </CardTitle>
                    <CardDescription className="font-space">
                      Galactic member since {joinDate}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Profile Settings */}
            <Card className="alien-hover-lift bg-card/95 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="font-space text-foreground flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-primary" />
                  Profile Settings
                </CardTitle>
                <CardDescription className="font-space">
                  Update your personal information and cosmic preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm font-space text-foreground">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-input border-border focus:border-primary rounded-xl"
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-space text-foreground flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-accent" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border focus:border-primary rounded-xl"
                    placeholder="Enter your email"
                  />
                </div>

                <Button 
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="w-full alien-button bg-primary hover:bg-primary/90 text-primary-foreground font-space font-semibold"
                >
                  {isUpdating ? (
                    <div className="ufo-loader scale-50 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="alien-hover-lift bg-card/95 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="font-space text-foreground flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-accent" />
                  Galactic Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-background/50 rounded-xl border border-border">
                    <div className="text-2xl font-space font-bold text-primary glow-text-purple">0</div>
                    <div className="text-sm font-space text-muted-foreground">Total Bookings</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-xl border border-border">
                    <div className="text-2xl font-space font-bold text-accent glow-text-blue">0</div>
                    <div className="text-sm font-space text-muted-foreground">Saved Rooms</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-xl border border-border">
                    <div className="text-2xl font-space font-bold text-alien-green glow-text-green">0</div>
                    <div className="text-sm font-space text-muted-foreground">Reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supabase Integration Notice */}
            <Card className="alien-hover-lift bg-card/95 backdrop-blur-sm border-accent/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🛸</div>
                  <h3 className="font-space font-bold text-accent mb-2">
                    Enhanced Cosmic Features Available
                  </h3>
                  <p className="text-muted-foreground font-space mb-4">
                    Connect to Supabase for full profile management, booking history, 
                    and personalized galactic recommendations.
                  </p>
                  <Button 
                    variant="outline" 
                    className="alien-button-blue border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;