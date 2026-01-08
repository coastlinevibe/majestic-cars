import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CarCard, { Car } from './CarCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { carService } from '@/lib/supabase';

const NewListings = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cars from Supabase
  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    setLoading(true);
    try {
      const data = await carService.getAllCars();
      
      // Transform Supabase cars to match CarCard interface and get only the 4 most recent
      const transformedCars: Car[] = data.slice(0, 4).map((car: any) => ({
        id: car.id,
        name: `${car.make} ${car.model}`,
        price: car.price,
        year: car.year,
        fuel: car.fuel_type || 'Petrol',
        mileage: car.mileage || 0,
        seats: car.seats || 5,
        location: car.location || 'Location TBD',
        description: car.description || '',
        image: car.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
        type: (car.body_type?.toLowerCase() || 'sedan') as 'sedan' | 'suv' | 'coupe' | 'hatchback',
      }));
      
      setCars(transformedCars);
    } catch (error) {
      console.error('Error loading cars:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

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
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  return (
    <section ref={sectionRef} className="section-padding bg-background">
      <div className="sterling-container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-foreground mb-4">
            New Listings
          </h2>
          <p className="text-muted-foreground text-lg">
            Check out our latest vehicles
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No vehicles available yet. Check back soon!</p>
          </div>
        ) : (
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
        )}

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
