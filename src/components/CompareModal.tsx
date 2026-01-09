import { X, Check, Star, TrendingUp, Fuel, Gauge, Users, MapPin, Calendar, Car as CarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Car } from '@/components/CarCard';
import { Link } from 'react-router-dom';

import bmwM8 from '@/assets/cars/bmw-m8.jpg';
import mercedesAmgGt from '@/assets/cars/mercedes-amg-gt.jpg';
import audiRs6 from '@/assets/cars/audi-rs6.jpg';
import audiTt from '@/assets/cars/audi-tt.jpg';
import bmwX7 from '@/assets/cars/bmw-x7.jpg';

interface CompareModalProps {
  cars: Car[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveCar: (carId: string) => void;
}

interface CompareSpec {
  label: string;
  icon: React.ElementType;
  getValue: (car: Car) => string | number;
  compareType?: 'lower' | 'higher';
}

const allCars: Car[] = [
  { id: '1', name: 'BMW M8', price: 1295000, year: 2023, fuel: 'Petrol', mileage: 45000, seats: 5, location: 'Pretoria, South Africa', description: '', image: bmwM8, type: 'coupe' },
  { id: '2', name: 'Mercedes AMG GT', price: 2450000, year: 2023, fuel: 'Hybrid', mileage: 12000, seats: 2, location: 'Johannesburg, South Africa', description: '', image: mercedesAmgGt, type: 'coupe' },
  { id: '3', name: 'Audi RS6', price: 880500, year: 2022, fuel: 'Petrol', mileage: 28500, seats: 5, location: 'Cape Town, South Africa', description: '', image: audiRs6, type: 'sedan' },
  { id: '4', name: 'Audi TT', price: 750000, year: 2024, fuel: 'Petrol', mileage: 8500, seats: 2, location: 'Durban, South Africa', description: '', image: audiTt, type: 'coupe' },
  { id: '5', name: 'BMW X7', price: 1950000, year: 2024, fuel: 'Petrol', mileage: 15000, seats: 7, location: 'Sandton, South Africa', description: '', image: bmwX7, type: 'suv' },
];

const specs: CompareSpec[] = [
  { label: 'Price', icon: TrendingUp, getValue: (car) => `R ${car.price.toLocaleString()}`, compareType: 'lower' },
  { label: 'Year', icon: Calendar, getValue: (car) => car.year, compareType: 'higher' },
  { label: 'Fuel Type', icon: Fuel, getValue: (car) => car.fuel },
  { label: 'Mileage', icon: Gauge, getValue: (car) => `${car.mileage.toLocaleString()} km`, compareType: 'lower' },
  { label: 'Seats', icon: Users, getValue: (car) => `${car.seats} seats`, compareType: 'higher' },
  { label: 'Body Type', icon: CarIcon, getValue: (car) => car.type.charAt(0).toUpperCase() + car.type.slice(1) },
  { label: 'Location', icon: MapPin, getValue: (car) => car.location },
];

const CompareModal = ({ cars, isOpen, onClose, onRemoveCar }: CompareModalProps) => {
  if (!isOpen || cars.length === 0) return null;

  const getBestValue = (spec: CompareSpec) => {
    if (spec.compareType === 'lower') {
      if (spec.label === 'Price') return Math.min(...cars.map((c) => c.price));
      if (spec.label === 'Mileage') return Math.min(...cars.map((c) => c.mileage));
    }
    if (spec.compareType === 'higher') {
      if (spec.label === 'Year') return Math.max(...cars.map((c) => c.year));
      if (spec.label === 'Seats') return Math.max(...cars.map((c) => c.seats));
    }
    return null;
  };

  const isBest = (car: Car, spec: CompareSpec) => {
    const bestValue = getBestValue(spec);
    if (bestValue === null) return false;
    if (spec.label === 'Price') return car.price === bestValue;
    if (spec.label === 'Year') return car.year === bestValue;
    if (spec.label === 'Mileage') return car.mileage === bestValue;
    if (spec.label === 'Seats') return car.seats === bestValue;
    return false;
  };

  // Calculate overall winner based on best values
  const getOverallScore = (car: Car) => {
    let score = 0;
    specs.forEach((spec) => {
      if (isBest(car, spec)) score++;
    });
    return score;
  };

  const sortedByScore = [...cars].sort((a, b) => getOverallScore(b) - getOverallScore(a));
  const winner = sortedByScore[0];

  // Get suggested cars that aren't in comparison
  const suggestedCars = allCars
    .filter((c) => !cars.some((compared) => compared.id === c.id))
    .slice(0, 2);

  // Calculate average price of compared cars for price comparison
  const avgPrice = cars.reduce((sum, c) => sum + c.price, 0) / cars.length;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
      <div
        className="bg-card rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-black text-foreground">Compare Cars</h2>
            <p className="text-muted-foreground">
              Comparing {cars.length} car{cars.length !== 1 ? 's' : ''} side by side
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-secondary hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Car Headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${cars.length}, 1fr)` }}>
            <div className="flex items-end">
              <span className="text-sm font-semibold text-muted-foreground">Specifications</span>
            </div>
            {cars.map((car) => (
              <div key={car.id} className="relative">
                <button
                  onClick={() => onRemoveCar(car.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs z-10 hover:scale-110 transition-transform"
                >
                  <X size={14} />
                </button>
                {winner?.id === car.id && cars.length > 1 && (
                  <div className="absolute -top-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                    <Star size={12} /> Best Match
                  </div>
                )}
                <div className={`bg-secondary rounded-xl p-4 ${winner?.id === car.id && cars.length > 1 ? 'ring-2 ring-primary' : ''}`}>
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-36 object-cover mb-3 rounded-lg"
                  />
                  <h3 className="font-bold text-foreground text-center text-lg">{car.name}</h3>
                  <p className="text-primary font-black text-center text-xl mt-1">
                    R {car.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Specs Table */}
          <div className="mt-8 space-y-1">
            <div className="grid gap-4 items-center py-3 bg-muted/50 rounded-t-lg px-4" style={{ gridTemplateColumns: `200px repeat(${cars.length}, 1fr)` }}>
              <div className="font-bold text-foreground text-sm uppercase tracking-wide">Feature</div>
              {cars.map((car) => (
                <div key={car.id} className="font-bold text-foreground text-center text-sm uppercase tracking-wide">
                  {car.name}
                </div>
              ))}
            </div>
            {specs.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.label}
                  className={`grid gap-4 items-center py-4 px-4 ${idx % 2 === 0 ? 'bg-muted/30' : ''}`}
                  style={{ gridTemplateColumns: `200px repeat(${cars.length}, 1fr)` }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-primary" />
                    <span className="font-semibold text-foreground">{spec.label}</span>
                  </div>
                  {cars.map((car) => {
                    const value = spec.getValue(car);
                    const isBestValue = isBest(car, spec);
                    return (
                      <div
                        key={car.id}
                        className={`text-center p-3 rounded-lg transition-colors ${
                          isBestValue ? 'bg-primary/15 text-primary font-bold' : 'text-foreground'
                        }`}
                      >
                        <span className="text-base">{value}</span>
                        {isBestValue && (
                          <Check size={16} className="inline-block ml-2 text-primary" />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Comparison Summary
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Lowest Price</p>
                <p className="font-bold text-foreground">
                  {sortedByScore.find((c) => c.price === Math.min(...cars.map((car) => car.price)))?.name}
                </p>
                <p className="text-primary font-semibold">
                  R {Math.min(...cars.map((c) => c.price)).toLocaleString()}
                </p>
              </div>
              <div className="bg-card rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Lowest Mileage</p>
                <p className="font-bold text-foreground">
                  {sortedByScore.find((c) => c.mileage === Math.min(...cars.map((car) => car.mileage)))?.name}
                </p>
                <p className="text-primary font-semibold">
                  {Math.min(...cars.map((c) => c.mileage)).toLocaleString()} km
                </p>
              </div>
              <div className="bg-card rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Newest Model</p>
                <p className="font-bold text-foreground">
                  {sortedByScore.find((c) => c.year === Math.max(...cars.map((car) => car.year)))?.name}
                </p>
                <p className="text-primary font-semibold">
                  {Math.max(...cars.map((c) => c.year))}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 grid gap-4" style={{ gridTemplateColumns: `200px repeat(${cars.length}, 1fr)` }}>
            <div></div>
            {cars.map((car) => (
              <div key={car.id}>
                <Button asChild className="w-full">
                  <Link to={`/inventory/${car.id}`}>View Full Details</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Suggested Cars Section */}
          {suggestedCars.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <h3 className="font-bold text-foreground text-lg mb-2 flex items-center gap-2">
                <Star size={20} className="text-primary" />
                You Might Also Like
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Based on your comparison, here are some similar vehicles you might be interested in
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {suggestedCars.map((car) => (
                  <div key={car.id} className="bg-secondary rounded-xl p-4 flex gap-4 items-center hover:bg-muted transition-colors">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">{car.name}</h4>
                      <p className="text-primary font-bold text-lg">R {car.price.toLocaleString()}</p>
                      <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                        <span>{car.year}</span>
                        <span>•</span>
                        <span>{car.mileage.toLocaleString()} km</span>
                        <span>•</span>
                        <span>{car.fuel}</span>
                      </div>
                      {car.price < avgPrice && (
                        <span className="inline-block mt-2 text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full font-medium">
                          Lower than avg. price
                        </span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/inventory/${car.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareModal;