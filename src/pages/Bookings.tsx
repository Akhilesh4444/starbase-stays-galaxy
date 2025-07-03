import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock booking data - in real app this would come from Supabase
const mockBookings = [
  {
    id: '1',
    roomName: 'Jedi Suite',
    location: 'Coruscant District, New York',
    checkIn: '2024-02-15',
    checkOut: '2024-02-18',
    guests: 2,
    totalPrice: 450,
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: '2',
    roomName: 'Rebel Base',
    location: 'Yavin Hub, Miami',
    checkIn: '2024-03-01',
    checkOut: '2024-03-05',
    guests: 4,
    totalPrice: 480,
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center'
  }
];

const Bookings = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-exo mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-2">
            <span className="text-accent glow-text-blue">MY</span>{' '}
            <span className="text-primary glow-text-red">BOOKINGS</span>
          </h1>
          <p className="text-muted-foreground font-exo">
            Track your galactic adventures and upcoming stays
          </p>
        </div>

        {/* Supabase Integration Notice */}
        <Card className="bg-card/95 backdrop-blur-sm border-accent/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-accent mb-2">
                  Connect to Supabase for Full Functionality
                </h3>
                <p className="text-muted-foreground font-exo mb-4">
                  To enable real booking management, user authentication, and data persistence, 
                  connect your Lovable project to Supabase using the green Supabase button in the top right.
                </p>
                <Button 
                  variant="outline" 
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  Learn More About Supabase Integration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {mockBookings.length > 0 ? (
          <div className="grid gap-6">
            {mockBookings.map((booking) => (
              <Card key={booking.id} className="hover-lift bg-card/95 backdrop-blur-sm border-border">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-48 flex-shrink-0">
                    <img 
                      src={booking.image} 
                      alt={booking.roomName}
                      className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-orbitron font-bold text-foreground mb-1">
                          {booking.roomName}
                        </h3>
                        <div className="flex items-center text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="font-exo text-sm">{booking.location}</span>
                        </div>
                      </div>
                      
                      <Badge className={`${getStatusColor(booking.status)} font-exo`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    
                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <div className="font-exo text-sm">
                          <div>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</div>
                          <div>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="font-exo text-sm text-muted-foreground">
                        <div>Guests: {booking.guests}</div>
                        <div>Booking ID: #{booking.id}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-orbitron font-bold text-primary">
                          ${booking.totalPrice}
                        </div>
                        <div className="text-sm text-muted-foreground font-exo">
                          Total Amount
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-border hover:border-primary hover:text-primary font-exo"
                      >
                        View Details
                      </Button>
                      {booking.status === 'confirmed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-border hover:border-accent hover:text-accent font-exo"
                        >
                          Modify Booking
                        </Button>
                      )}
                      {booking.status === 'pending' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="font-exo"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="death-star-loader mx-auto opacity-30" />
            </div>
            <h3 className="text-xl font-orbitron font-bold text-muted-foreground mb-2">
              No Bookings Found
            </h3>
            <p className="text-muted-foreground font-exo mb-6">
              You haven't made any bookings yet. Start exploring the galaxy!
            </p>
            <Link to="/">
              <Button className="lightsaber-button bg-primary hover:bg-primary/90 text-primary-foreground font-exo font-semibold">
                Start Booking
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookings;