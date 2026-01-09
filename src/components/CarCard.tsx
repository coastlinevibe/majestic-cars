import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Fuel, Gauge, Users, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export interface Car {
  id: string;
  name: string;
  price: number;
  year: number;
  fuel: string;
  mileage: number;
  seats: number;
  location: string;
  description: string;
  image: string;
  type: 'sedan' | 'suv' | 'coupe' | 'hatchback';
}

interface CarCardProps {
  car: Car;
  onCompare?: (car: Car) => void;
  isInCompare?: boolean;
}

const CarCard = ({ car, onCompare, isInCompare = false }: CarCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price: number) => {
    return `R ${price.toLocaleString()}`;
  };

  return (
    <div className="car-card">
      <div className="relative m-3 mb-1">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-[220px] object-contain bg-secondary rounded-[14px] p-2"
        />
        {onCompare && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onCompare(car);
            }}
            className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isInCompare
                ? 'bg-primary text-primary-foreground'
                : 'bg-card/90 text-muted-foreground hover:bg-primary hover:text-primary-foreground'
            }`}
            title={isInCompare ? 'Remove from compare' : 'Add to compare'}
          >
            <GitCompare size={16} />
          </button>
        )}
      </div>

      <div className="p-4 pt-2 flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-foreground">{car.name}</h3>
          <span className="font-bold text-primary">{formatPrice(car.price)}</span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="spec-item">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-xs text-foreground">{car.year}</span>
          </div>
          <div className="spec-item">
            <Fuel size={16} className="text-muted-foreground" />
            <span className="text-xs text-foreground">{car.fuel}</span>
          </div>
          <div className="spec-item">
            <Gauge size={16} className="text-muted-foreground" />
            <span className="text-xs text-foreground">{car.mileage.toLocaleString()}</span>
          </div>
          <div className="spec-item">
            <Users size={16} className="text-muted-foreground" />
            <span className="text-xs text-foreground">{car.seats} Seater</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <MapPin size={16} />
          <span>{car.location}</span>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2">
          {car.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2 items-center">
          <Button asChild className="flex-1">
            <Link to={`/inventory/${car.id}`}>View Vehicle</Link>
          </Button>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
