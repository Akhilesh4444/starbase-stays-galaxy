import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, MapPin, Calendar as CalendarIcon, Users, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export interface SearchFilters {
  destination: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: string;
  species: string;
}

const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('1');
  const [species, setSpecies] = useState('humanoid');

  const handleSearch = () => {
    onSearch({
      destination,
      checkIn,
      checkOut,
      guests,
      species
    });
  };

  return (
    <div className="bg-card/90 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 shadow-2xl max-w-5xl mx-auto relative overflow-hidden">
      {/* Alien decoration */}
      <div className="absolute top-4 right-4 text-2xl opacity-30 animate-bounce">
        🛸
      </div>
      <div className="absolute bottom-4 left-4 text-xl opacity-20 planet-rotate">
        🪐
      </div>
      
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-alien font-bold text-primary glow-text-purple mb-2">
          Galactic Search Console
        </h2>
        <p className="text-muted-foreground font-space">
          Find your perfect accommodation across the known universe
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* Destination Input */}
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-sm font-space text-foreground flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            Planet/System
          </Label>
          <Input
            id="destination"
            placeholder="Enter planet or system..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="bg-input border-border focus:border-primary focus:ring-primary/20 rounded-xl"
          />
        </div>

        {/* Check-in Date */}
        <div className="space-y-2">
          <Label className="text-sm font-space text-foreground flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1 text-accent" />
            Arrival
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-input border-border hover:border-accent rounded-xl",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, "MMM dd") : "Select"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <Label className="text-sm font-space text-foreground flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1 text-accent" />
            Departure
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-input border-border hover:border-accent rounded-xl",
                  !checkOut && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, "MMM dd") : "Select"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label className="text-sm font-space text-foreground flex items-center">
            <Users className="w-4 h-4 mr-1 text-alien-green" />
            Travelers
          </Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="bg-input border-border focus:border-primary rounded-xl">
              <SelectValue placeholder="Select guests" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Being' : 'Beings'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Species Type */}
        <div className="space-y-2">
          <Label className="text-sm font-space text-foreground flex items-center">
            <Zap className="w-4 h-4 mr-1 text-plasma-pink" />
            Species
          </Label>
          <Select value={species} onValueChange={setSpecies}>
            <SelectTrigger className="bg-input border-border focus:border-primary rounded-xl">
              <SelectValue placeholder="Select species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="humanoid">Humanoid</SelectItem>
              <SelectItem value="silicon">Silicon-based</SelectItem>
              <SelectItem value="energy">Energy Being</SelectItem>
              <SelectItem value="aquatic">Aquatic</SelectItem>
              <SelectItem value="gaseous">Gaseous</SelectItem>
              <SelectItem value="crystalline">Crystalline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <div className="text-center">
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          className="alien-button bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-space font-semibold rounded-xl"
        >
          {isLoading ? (
            <div className="ufo-loader scale-50 mr-2" />
          ) : (
            <Search className="w-5 h-5 mr-2" />
          )}
          {isLoading ? 'Scanning Universe...' : 'Begin Galactic Search'}
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;