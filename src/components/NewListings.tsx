import { Link } from 'react-router-dom';
import CarCard, { Car } from './CarCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

import bmwM8 from '@/assets/cars/bmw-m8.jpg';
import mercedesAmgGt from '@/assets/cars/mercedes-amg-gt.jpg';
import audiRs6 from '@/assets/cars/audi-rs6.jpg';
import audiTt from '@/assets/cars/audi-tt.jpg';

const cars: Car[] = [
  {
    id: '1',
    name: 'BMW M8',
    price: 1295000,
    year: 2023,
    fuel: 'Petrol',
    mileage: 45000,
    seats: 5,
    location: 'Cape Town, South Africa',
    description: 'Experience luxury and performance with the BMW M8. A dream car for true connoisseurs of automotive excellence.',
    image: bmwM8,
    type: 'coupe',
  },
  {
    id: '2',
    name: 'Mercedes AMG GT',
    price: 2450000,
    year: 2023,
    fuel: 'Hybrid',
    mileage: 12000,
    seats: 2,
    location: 'Johannesburg, South Africa',
    description: 'Pure luxury and performance. The Mercedes AMG GT 63 SE combines cutting-edge hybrid technology with timeless elegance.',
    image: mercedesAmgGt,
    type: 'coupe',
  },
  {
    id: '3',
    name: 'Audi RS6',
    price: 880500,
    year: 2022,
    fuel: 'Petrol',
    mileage: 28500,
    seats: 5,
    location: 'Durban, South Africa',
    description: 'Sporty performance meets luxury. The Audi RS6 delivers an exhilarating driving experience with iconic design.',
    image: audiRs6,
    type: 'sedan',
  },
  {
    id: '4',
    name: 'Audi TT',
    price: 750000,
    year: 2024,
    fuel: 'Petrol',
    mileage: 8500,
    seats: 2,
    location: 'Pretoria, South Africa',
    description: 'Iconic sports coupe design meets modern performance. The Audi TT delivers thrilling dynamics.',
    image: audiTt,
    type: 'coupe',
  },
];

const NewListings = () => {
  return (
    <section className="section-padding bg-background">
      <div className="sterling-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-foreground mb-4">
            New Listings
          </h2>
          <p className="text-muted-foreground text-lg">
            Check out our latest vehicles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cars.map((car, index) => (
            <div
              key={car.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CarCard car={car} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link to="/inventory">
              View All Vehicles
              <ChevronRight className="ml-2" size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewListings;
