import { useEffect, useRef, useState } from 'react';
import { Users, Car, Star, Award, Headphones, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const stats = [
  {
    icon: Users,
    value: 5000,
    suffix: '+',
    label: 'Happy Customers',
    description: 'Join thousands of satisfied customers who have found their dream car through us with confidence.',
  },
  {
    icon: Car,
    value: 50,
    suffix: '+',
    label: 'Premium Cars',
    description: 'Carefully curated collection of luxury and performance cars to suit all tastes.',
  },
  {
    icon: Star,
    value: 4.9,
    suffix: '',
    label: 'Customer Satisfaction',
    description: 'Industry-leading satisfaction rates backed by our commitment to service excellence.',
    decimals: 1,
  },
  {
    icon: Award,
    value: 4,
    suffix: '+',
    label: 'Years Experience',
    description: 'Over four years of expertise in premium automotive sales and service.',
  },
  {
    icon: Headphones,
    value: 24,
    suffix: '/7',
    label: 'Customer Support',
    description: 'Round-the-clock customer support for all your automotive needs and questions.',
  },
  {
    icon: CheckCircle,
    value: 100,
    suffix: '%',
    label: 'Certified Cars',
    description: 'Every car undergoes rigorous inspection and comes with warranty coverage.',
  },
];

const AnimatedCounter = ({ value, decimals = 0 }: { value: number; decimals?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(latest.toFixed(decimals));
    });
    return unsubscribe;
  }, [springValue, decimals]);

  return <span ref={ref}>{displayValue}</span>;
};

const TrustSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [currentSlide, setCurrentSlide] = useState(0);

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
      y: 50,
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % stats.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + stats.length) % stats.length);
  };

  return (
    <section ref={sectionRef} className="section-padding bg-card">
      <div className="sterling-container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-8 md:mb-12 px-4"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3 md:mb-4">
            Why us
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Proven excellence backed by real numbers and customer satisfaction
          </p>
        </motion.div>
      </div>

      {/* Desktop Grid View */}
      <div className="sterling-container hidden md:block">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                className="trust-card"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.6,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4"
                >
                  <Icon size={32} className="text-primary" />
                </motion.div>
                <div className="text-4xl font-black text-primary mb-2">
                  <AnimatedCounter value={stat.value} decimals={stat.decimals || 0} />
                  {stat.suffix}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {stat.label}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Mobile Carousel View */}
      <div className="md:hidden w-full">
        <div className="overflow-hidden">
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
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="w-full flex-shrink-0 px-4">
                  <div className="trust-card">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={isInView ? { scale: 1, rotate: 0 } : {}}
                      transition={{
                        delay: 0.3 + index * 0.1,
                        duration: 0.6,
                        ease: [0.25, 0.4, 0.25, 1],
                      }}
                      className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4"
                    >
                      <Icon size={32} className="text-primary" />
                    </motion.div>
                    <div className="text-4xl font-black text-primary mb-2">
                      <AnimatedCounter value={stat.value} decimals={stat.decimals || 0} />
                      {stat.suffix}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {stat.label}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Carousel Controls - Below Card */}
        <div className="flex justify-center items-center gap-4 mt-6 px-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
              currentSlide === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                : 'bg-card hover:bg-primary hover:text-primary-foreground'
            }`}
            aria-label="Previous stat"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {stats.map((_, index) => (
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
            disabled={currentSlide === stats.length - 1}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
              currentSlide === stats.length - 1
                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                : 'bg-card hover:bg-primary hover:text-primary-foreground'
            }`}
            aria-label="Next stat"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
