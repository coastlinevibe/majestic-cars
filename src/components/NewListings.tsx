import { useRef } from 'react';
import { Link } from 'react-router-dom';
import CarCard, { Car } from './CarCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      filter: 'blur(10px)',
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <section ref={sectionRef} className="section-padding bg-background">
      <div className="sterling-container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-foreground mb-4">
            New Listings
          </h2>
          <p className="text-muted-foreground text-lg">
            Check out our latest vehicles
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {cars.map((car) => (
            <motion.div
              key={car.id}
              variants={cardVariants}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="outline">
            <Link to="/inventory">
              View All Vehicles
              <ChevronRight className="ml-2" size={20} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default NewListings;
