import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, Star, Users, MapPin, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import SearchBar, { SearchFilters } from '@/components/SearchBar';
import RoomCard from '@/components/RoomCard';
import FiltersSidebar, { FilterState } from '@/components/FiltersSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchRooms, Room, RoomFilters } from '@/lib/supabase-rooms';
import { useToast } from '@/hooks/use-toast';

// Alien user reviews data
const alienReviews = [
  {
    id: 1,
    text: "Best zero-gravity bed I've slept in! The plasma shower was incredible! 🛸",
    author: "Zorgon",
    location: "Jupiter Station",
    avatar: "👽",
    rating: 5
  },
  {
    id: 2,
    text: "Food from the 6th dimension? YES PLEASE! My tentacles have never been happier!",
    author: "Klatu",
    location: "Sector 9",
    avatar: "🐙",
    rating: 5
  },
  {
    id: 3,
    text: "The teleportation pad worked flawlessly. No molecular displacement at all!",
    author: "Xen'tar",
    location: "Andromeda Galaxy",
    avatar: "👾",
    rating: 4
  },
  {
    id: 4,
    text: "Perfect for my crystalline structure. The mineral baths were divine! ✨",
    author: "Quartz-7",
    location: "Crystal Nebula",
    avatar: "💎",
    rating: 5
  },
  {
    id: 5,
    text: "Great atmosphere for photosynthesis. My chlorophyll levels are through the roof!",
    author: "Leafy McBranch",
    location: "Plant Planet",
    avatar: "🌱",
    rating: 4
  },
  {
    id: 6,
    text: "The anti-gravity pool was amazing! My three hearts were pumping with joy!",
    author: "Blurp",
    location: "Aqua World",
    avatar: "🐠",
    rating: 5
  },
  {
    id: 7,
    text: "Excellent cosmic radiation shielding. My scales stayed perfectly moisturized!",
    author: "Ssslither",
    location: "Reptilian Prime",
    avatar: "🦎",
    rating: 4
  }
];

const Browse = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [topRooms, setTopRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('alien-sound-enabled') === 'true';
  });
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FilterState>({
    priceMin: '',
    priceMax: '',
    amenities: [],
    roomType: 'all'
  });

  // Load initial rooms
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setIsLoading(true);
        const roomsData = await fetchRooms();
        setRooms(roomsData);
        // Get top 10 highest rated rooms for "Guest Favourites"
        const sortedByRating = [...roomsData].sort((a, b) => b.rating - a.rating);
        setTopRooms(sortedByRating.slice(0, 10));
      } catch (error) {
        console.error('Error loading rooms:', error);
        toast({
          title: "Error",
          description: "Failed to load accommodations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, [toast]);

  const playAlienSound = () => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
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

  const handleSearch = async (searchFilters: SearchFilters) => {
    setIsSearching(true);
    
    try {
      const roomFilters: RoomFilters = {
        location: searchFilters.destination,
        maxGuests: searchFilters.guests ? parseInt(searchFilters.guests) : undefined,
      };

      const searchResults = await fetchRooms(roomFilters);
      setRooms(searchResults);

      toast({
        title: "Galactic Search Complete! 🛸",
        description: `Found ${searchResults.length} cosmic accommodations matching your criteria`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error searching rooms:', error);
      toast({
        title: "Search Error",
        description: "Failed to search accommodations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId) || topRooms.find(r => r.id === roomId);
    if (room) {
      toast({
        title: "Booking Initiated! 🚀",
        description: `Preparing to book ${room.name}. Authentication required for full booking system.`,
        duration: 4000,
      });
    }
  };

  const handleApplyFilters = async () => {
    setIsFiltersOpen(false);
    if (soundEnabled) playAlienSound();
    
    try {
      setIsLoading(true);
      
      const roomFilters: RoomFilters = {
        minPrice: filters.priceMin ? parseFloat(filters.priceMin) : undefined,
        maxPrice: filters.priceMax ? parseFloat(filters.priceMax) : undefined,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        roomType: filters.roomType !== 'all' ? filters.roomType : undefined,
      };

      const filteredRooms = await fetchRooms(roomFilters);
      setRooms(filteredRooms);
      
      toast({
        title: "Filters Applied! ✨",
        description: `Found ${filteredRooms.length} matching cosmic accommodations`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error applying filters:', error);
      toast({
        title: "Filter Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      amenities: [],
      roomType: 'all'
    });
    
    try {
      setIsLoading(true);
      const allRooms = await fetchRooms();
      setRooms(allRooms);
      
      toast({
        title: "Filters Cleared! 🌌",
        description: "All filters have been reset",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error clearing filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Search */}
        <section className="text-center mb-16 relative">
          {/* Floating alien elements */}
          <div className="absolute top-0 left-10 text-4xl opacity-20 animate-bounce" style={{animationDelay: '0s'}}>
            🛸
          </div>
          <div className="absolute top-20 right-20 text-3xl opacity-15 planet-rotate">
            🪐
          </div>
          <div className="absolute top-40 left-1/4 text-2xl opacity-25 alien-pulse">
            ☄️
          </div>
          
          <div className="max-w-5xl mx-auto mb-8 relative z-10">
            <h1 className="text-5xl md:text-7xl font-alien font-bold mb-6">
              <span className="text-primary glow-text-purple">ALIEN</span>{' '}
              <span className="text-accent glow-text-blue">AIRBNB</span>
            </h1>
            <div className="text-2xl md:text-3xl font-space font-bold text-alien-green glow-text-green mb-8">
              "If you want to get out of the busy war world,<br />
              you've found the best place in the galaxy."
            </div>
            <p className="text-xl text-muted-foreground font-space mb-8">
              Discover extraordinary accommodations across the universe. 
              From zero-gravity suites to plasma pools, your perfect cosmic stay awaits! 🌌
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </section>

        {/* Guest Favourites Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-alien font-bold text-primary glow-text-purple mb-4">
              <Sparkles className="inline w-8 h-8 mr-2" />
              Guest Favourites
              <Sparkles className="inline w-8 h-8 ml-2" />
            </h2>
            <p className="text-muted-foreground font-space text-lg">
              Top 10 cosmic accommodations loved by beings across the galaxy
            </p>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Loading cosmic favourites..." size="lg" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {topRooms.map((room, index) => (
                <div key={room.id} className="relative">
                  {index < 3 && (
                    <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-primary to-accent text-white font-space font-bold">
                      #{index + 1}
                    </Badge>
                  )}
                  <RoomCard
                    room={room}
                    onBook={handleBookRoom}
                    playSound={soundEnabled ? playAlienSound : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Alien Reviews Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-alien font-bold text-accent glow-text-blue mb-4">
              What Our Galactic Guests Say
            </h2>
            <p className="text-muted-foreground font-space text-lg">
              Real reviews from beings across the known universe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alienReviews.map((review) => (
              <Card key={review.id} className="alien-hover-lift bg-card/95 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-3xl">{review.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h4 className="font-space font-bold text-foreground">{review.author}</h4>
                        <div className="flex ml-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-space flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {review.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground font-space italic">
                    "{review.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Accommodations Section */}
        <section className="lg:grid lg:grid-cols-[300px,1fr] lg:gap-8">
          {/* Filters Sidebar */}
          <FiltersSidebar
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />

          {/* Main Content */}
          <div className="lg:pl-0">
            {/* Mobile Filter Button */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setIsFiltersOpen(true)}
                className="border-border hover:border-primary alien-button"
              >
                <Filter className="w-4 h-4 mr-2" />
                Cosmic Filters
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-alien font-bold text-foreground">
                All Galactic Accommodations
              </h2>
              <span className="text-muted-foreground font-space">
                {rooms.length} cosmic results
              </span>
            </div>

            {/* Loading State */}
            {isLoading && (
              <LoadingSpinner 
                message="Scanning the universe for perfect accommodations..." 
                size="lg"
              />
            )}

            {/* Results Grid */}
            {!isLoading && (
              <>
                {rooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        onBook={handleBookRoom}
                        playSound={soundEnabled ? playAlienSound : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4 text-6xl">
                      👽
                    </div>
                    <h3 className="text-xl font-alien font-bold text-muted-foreground mb-2">
                      No Cosmic Accommodations Found
                    </h3>
                    <p className="text-muted-foreground font-space">
                      Try adjusting your search criteria or clearing filters
                    </p>
                    <Button 
                      onClick={handleClearFilters}
                      variant="outline"
                      className="mt-4 alien-button border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">🛸</div>
                <div className="font-alien font-bold text-primary glow-text-purple text-xl">
                  AlienAirbnb
                </div>
              </div>
              <p className="text-muted-foreground font-space text-sm mb-4">
                Your gateway to extraordinary accommodations across the known and unknown universe.
              </p>
              <p className="text-xs text-muted-foreground font-space">
                © 2025 AlienAirbnb Intergalactic Inc. All rights reserved across known and unknown galaxies.
              </p>
            </div>
            
            <div>
              <h4 className="font-space font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-space">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Galactic Travel Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-space font-bold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-space">
                <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Species Guidelines</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Teleportation Safety</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Emergency Protocols</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Browse;