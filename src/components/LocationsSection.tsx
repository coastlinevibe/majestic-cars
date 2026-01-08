import { useRef } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';

import newYorkImg from '@/assets/locations/new-york.jpg';
import losAngelesImg from '@/assets/locations/los-angeles.jpg';
import miamiImg from '@/assets/locations/miami.jpg';

const locations = [
  {
    name: 'Pretoria Showroom',
    address: '154 Sefako Makgatho Service Ln, Sinoville',
    phone: '+27 12 345 6789',
    hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
    image: newYorkImg,
  },
  {
    name: 'Johannesburg Showroom',
    address: '456 Sandton Drive, Sandton',
    phone: '+27 11 234 5678',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-5PM',
    image: losAngelesImg,
  },
  {
    name: 'Cape Town Showroom',
    address: '789 Waterfront Boulevard, V&A Waterfront',
    phone: '+27 21 987 6543',
    hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
    image: miamiImg,
  },
];

const LocationsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      filter: 'blur(10px)',
      rotateX: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      rotateX: 0,
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
          <h2 className="text-4xl font-black text-foreground mb-4" style={{ fontStyle: 'italic' }}>
            Our Locations
          </h2>
          <p className="text-muted-foreground text-lg">
            Visit us at one of our showrooms
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {locations.map((location) => (
            <motion.div
              key={location.name}
              variants={cardVariants}
              className="location-card"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="h-48 overflow-hidden"
              >
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </motion.div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {location.name}
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-muted-foreground text-sm">
                    <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <Phone size={16} className="text-primary flex-shrink-0" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground text-sm">
                    <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{location.hours}</span>
                  </div>
                </div>
                <Button className="w-full">
                  Get Directions
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LocationsSection;
