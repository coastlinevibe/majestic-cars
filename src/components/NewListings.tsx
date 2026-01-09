import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CarCard, { Car } from './CarCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2, ChevronLeft } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { carService } from '@/lib/supabase';

const NewListings = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % cars.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + cars.length) % cars.length);
  };

  return (
    <section ref={sectionRef} className="section-padding bg-background">
      {/* Title Section */}
      <div className="sterling-container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const }}
          className="text-center mb-8 md:mb-12 px-4"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3 md:mb-4">
            New Listings
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Check out our latest vehicles
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No vehicles available yet. Check back soon!</p>
        </div>
      ) : (
        <>
          {/* Desktop Grid View */}
          <div className="sterling-container hidden md:block">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
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
          </div>

          {/* Mobile Carousel View */}
          <div className="md:hidden w-full">
            <div className="overflow-hidden px-4">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x * velocity.x;
                  if (swipe < -500 || offset.x < -100) {
                    nextSlide();
                  } else if (swipe > 500 || offset.x > 100) {
                    prevSlide();
                  }
                }}
                animate={{ x: `-${currentSlide * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex cursor-grab active:cursor-grabbing"
              >
                {cars.map((car) => (
                  <div key={car.id} className="w-full flex-shrink-0 px-1">
                    <CarCard car={car} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Carousel Controls - Below Card */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  currentSlide === 0
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    : 'bg-card hover:bg-primary hover:text-primary-foreground'
                }`}
                aria-label="Previous car"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {cars.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={currentSlide === cars.length - 1}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  currentSlide === cars.length - 1
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    : 'bg-card hover:bg-primary hover:text-primary-foreground'
                }`}
                aria-label="Next car"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* View All Button */}
      <div className="sterling-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8 md:mt-12 px-4"
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
