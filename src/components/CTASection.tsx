import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Shield, Award, Headphones, Car } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import heroImage from '@/assets/hero-car.jpg';

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1, filter: 'blur(5px)' }}
        animate={isInView ? { scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
      
      <div className="sterling-container relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-4xl md:text-5xl font-black text-white mb-6"
          >
            Ready to Drive Your Dream Car?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-white/80 text-lg mb-8"
          >
            Join thousands of satisfied customers who found their perfect vehicle at Sterling Motors.
            Browse our premium collection today and find your next ride.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              asChild
            >
              <Link to="/inventory">
                <Car className="mr-2" size={20} />
                Browse Inventory
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <Link to="/contact">
                Contact Us
                <ChevronRight className="ml-2" size={20} />
              </Link>
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8"
          >
            {[
              { icon: Shield, text: '100% Certified Vehicles' },
              { icon: Award, text: 'Best Price Guarantee' },
              { icon: Headphones, text: '24/7 Support' },
            ].map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-2 text-white/80"
                >
                  <Icon size={20} className="text-primary" />
                  <span className="text-sm">{badge.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
