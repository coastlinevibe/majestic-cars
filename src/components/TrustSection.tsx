import { useEffect, useRef, useState } from 'react';
import { Users, Car, Star, Award, Headphones, CheckCircle } from 'lucide-react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const stats = [
  {
    icon: Users,
    value: 5000,
    suffix: '+',
    label: 'Happy Customers',
    description: 'Join thousands of satisfied customers who have found their dream vehicle through us with confidence.',
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
    label: 'Certified Vehicles',
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

  return (
    <section ref={sectionRef} className="section-padding bg-card">
      <div className="sterling-container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-foreground mb-4">
            Why Customers Trust Majesticars
          </h2>
          <p className="text-muted-foreground text-lg">
            Proven excellence backed by real numbers and customer satisfaction
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
    </section>
  );
};

export default TrustSection;
