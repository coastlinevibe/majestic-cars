import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-car.jpg';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Dream Car';
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  const slideInVariants = {
    hidden: { opacity: 0, x: -50, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  const glassCardVariants = {
    hidden: { opacity: 0, x: 50, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1,
        delay: 0.5,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.8 + i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with zoom animation */}
      <motion.div
        initial={{ scale: 1.1, filter: 'blur(5px)' }}
        animate={{ scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="hero-overlay" />

      <div className="relative z-10 sterling-container w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-32">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={slideInVariants}
              className="inline-block px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-[9px] text-sm font-semibold mb-6"
            >
              Honest & Transparent
            </motion.span>
            
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
            >
              Find Your
              <span className="block text-gradient-orange">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                  className="inline-block w-1 h-16 bg-primary ml-1 align-middle"
                  style={{ display: isTypingComplete ? 'none' : 'inline-block' }}
                />
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-white/80 text-lg mb-8 max-w-lg"
            >
              Where buying a car is simple, honest, and stress-free. No pushy sales talk, no hidden surprises — just good, reliable cars at fair prices.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" asChild>
                <Link to="/inventory">
                  Browse Cars
                  <ChevronRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="flex gap-8 mt-12"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-white/70 text-sm">100% Certified Vehicles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-white/70 text-sm">Best Price Guarantee</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Panel - Glass Navigation */}
          <motion.div
            variants={glassCardVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block"
          >
            <div className="glass-card rounded-2xl p-8">
              <nav className="space-y-4 mb-8">
                {['Browse Cars', 'About Us', 'FAQ', 'Contact'].map((item, idx) => (
                  <motion.div
                    key={item}
                    custom={idx}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={item === 'FAQ' ? '/faq' : item === 'Browse Cars' ? '/inventory' : `/${item.toLowerCase().replace(' ', '-')}`}
                      className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-white/10 transition-colors text-white group"
                    >
                      <span className="font-medium">{item}</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="border-t border-card/20 pt-6"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto bg-primary rounded-lg flex items-center justify-center mb-2">
                      <Mail size={18} className="text-primary-foreground" />
                    </div>
                    <p className="text-white/60 text-xs">Email</p>
                    <p className="text-white text-xs font-medium truncate">majesticcarssinoville@gmail.com</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto bg-primary rounded-lg flex items-center justify-center mb-2">
                      <Phone size={18} className="text-primary-foreground" />
                    </div>
                    <p className="text-white/60 text-xs">Phone</p>
                    <p className="text-white text-xs font-medium">060 857 9146</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto bg-primary rounded-lg flex items-center justify-center mb-2">
                      <MapPin size={18} className="text-primary-foreground" />
                    </div>
                    <p className="text-white/60 text-xs">Address</p>
                    <p className="text-white text-xs font-medium truncate">153 Sefako Makgatho</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
