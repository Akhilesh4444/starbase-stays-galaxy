import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X, Filter, Settings, Zap } from 'lucide-react';
import { getAllAmenities } from '@/lib/supabase-rooms';

export interface FilterState {
  priceMin: string;
  priceMax: string;
  amenities: string[];
  roomType: string;
}

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const roomTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'hotel', label: 'Space Hotel' },
  { value: 'apartment', label: 'Cosmic Apartment' },
  { value: 'suite', label: 'Luxury Suite' }
];

const FiltersSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onApplyFilters,
  onClearFilters 
}: FiltersSidebarProps) => {
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const amenities = await getAllAmenities();
        setAvailableAmenities(amenities);
      } catch (error) {
        console.error('Error loading amenities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAmenities();
  }, []);

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked 
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity);
    
    onFiltersChange({
      ...filters,
      amenities: newAmenities
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto
        w-80 lg:w-72 bg-card/95 backdrop-blur-md border-r border-border
        transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-space font-bold text-primary glow-text-purple">
                Cosmic Controls
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden hover:text-primary"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-space font-semibold text-foreground">
                Price Range (Credits/Night)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="priceMin" className="text-xs text-muted-foreground font-space">
                    Min
                  </Label>
                  <Input
                    id="priceMin"
                    type="number"
                    placeholder="0"
                    value={filters.priceMin}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      priceMin: e.target.value
                    })}
                    className="bg-input border-border focus:border-primary rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="priceMax" className="text-xs text-muted-foreground font-space">
                    Max
                  </Label>
                  <Input
                    id="priceMax"
                    type="number"
                    placeholder="1000"
                    value={filters.priceMax}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      priceMax: e.target.value
                    })}
                    className="bg-input border-border focus:border-primary rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Room Type */}
            <div className="space-y-3">
              <Label className="text-sm font-space font-semibold text-foreground">
                Accommodation Type
              </Label>
              <Select 
                value={filters.roomType} 
                onValueChange={(value) => onFiltersChange({
                  ...filters,
                  roomType: value
                })}
              >
                <SelectTrigger className="bg-input border-border focus:border-primary rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-border" />

            {/* Amenities */}
            <div className="space-y-3">
              <Label className="text-sm font-space font-semibold text-foreground">
                Cosmic Amenities
              </Label>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-6 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={filters.amenities.includes(amenity)}
                        onCheckedChange={(checked) => 
                          handleAmenityChange(amenity, checked as boolean)
                        }
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label 
                        htmlFor={amenity} 
                        className="text-sm font-space text-foreground cursor-pointer hover:text-primary transition-colors"
                      >
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={onApplyFilters}
                className="w-full alien-button bg-primary hover:bg-primary/90 text-primary-foreground font-space font-semibold"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              <Button 
                onClick={onClearFilters}
                variant="outline"
                className="w-full border-border hover:border-accent hover:text-accent font-space"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiltersSidebar;