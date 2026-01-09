import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { Button } from '@/components/ui/button';
import { Trophy, Heart, Shield, Rocket, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import aboutHeroImg from '@/assets/about-hero.jpg';

const values = [
  {
    icon: Trophy,
    title: 'Honesty',
    description: 'No pushy sales talk, no hidden surprises. We price our cars fairly from the start and treat every customer with respect.',
  },
  {
    icon: Heart,
    title: 'Transparency',
    description: 'Every car is fully inspected and we explain everything clearly. You know exactly what you\'re getting.',
  },
  {
    icon: Shield,
    title: 'Quality',
    description: 'Every car goes through a full inspection. If a car isn\'t up to standard, we don\'t sell it — simple as that.',
  },
  {
    icon: Rocket,
    title: 'Trust',
    description: 'Our reputation means everything to us. We\'re building something long-term, and that means treating customers right every single time.',
  },
];

const team = [
  {
    initials: 'JD',
    name: 'James Davidson',
    role: 'Founder & CEO',
    description: 'With over 30 years in the automotive industry, James founded Majesticars with a vision to redefine luxury car retail.',
  },
  {
    initials: 'SM',
    name: 'Sarah Mitchell',
    role: 'Sales Director',
    description: 'Sarah leads our sales team with expertise in luxury vehicles and a passion for exceptional customer experiences.',
  },
  {
    initials: 'MJ',
    name: 'Michael Johnson',
    role: 'Service Manager',
    description: 'Michael ensures every vehicle meets our quality standards and oversees our comprehensive service department.',
  },
];

const features = [
  { title: 'Full Inspections', description: 'Every car is carefully inspected to make sure it\'s safe, reliable, and ready to drive.' },
  { title: 'Finance Options', description: 'We work with trusted finance partners and explain everything clearly.' },
  { title: 'Trade-In Services', description: 'Bring your car in and we\'ll give you a fair, honest trade-in value with no pressure.' },
  { title: 'Test Drives', description: 'We encourage test drives — it\'s the best way to know if a car is right for you.' },
  { title: 'Warranty Options', description: 'Many of our cars come with warranty options for extra peace of mind.' },
  { title: 'Fair Pricing', description: 'We price our cars fairly from the start. No games, no fake discounts.' },
];

const About = () => {
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const storyInView = useInView(storyRef, { once: true, margin: '-100px' });
  const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' });
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });

  const [valuesSlide, setValuesSlide] = useState(0);
  const [featuresSlide, setFeaturesSlide] = useState(0);

  const nextValuesSlide = () => {
    setValuesSlide((prev) => (prev + 1) % values.length);
  };

  const prevValuesSlide = () => {
    setValuesSlide((prev) => (prev - 1 + values.length) % values.length);
  };

  const nextFeaturesSlide = () => {
    setFeaturesSlide((prev) => (prev + 1) % features.length);
  };

  const prevFeaturesSlide = () => {
    setFeaturesSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, filter: 'blur(5px)' }}
          animate={{ scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${aboutHeroImg})` }}
        />
        <div className="hero-overlay" />
        <div className="relative z-10 sterling-container text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4"
            style={{ fontFamily: 'serif', fontStyle: 'italic' }}
          >
            About Majesticars
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-white/80 text-lg md:text-xl"
            style={{ fontStyle: 'italic' }}
          >
            Simple, Honest, Stress-Free
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef} className="section-padding bg-card">
        <div className="sterling-container px-4">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
              animate={storyInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-6">Building trust one customer at a time</p>
              
              <div className="space-y-4 text-muted-foreground text-sm md:text-base">
                <p>
                  Majesticars started as a passion project. I've been into cars for as long as I can remember — flipping my first car while still in my teens, learning everything hands-on, and building trust one customer at a time. What began as buying and selling a few cars turned into a full dealership before I even turned 20.
                </p>
                <p>
                  I started this dealership because I was tired of seeing people my age (and honestly everyone else) get overcharged, confused, or pressured when buying a car. Here, it's different. No pushy sales talk, no hidden surprises — just good, reliable cars at fair prices.
                </p>
                <p>
                  Even though we're young, we take things seriously. Every car is carefully selected, inspected, and priced fairly. Our goal isn't just to sell cars — it's to build long-term relationships and a reputation we can stand behind. We're proud to be a modern dealership with old-school values: honesty, transparency, and respect.
                </p>
              </div>
            </motion.div>

            {/* Stats - 3 Column Grid on All Screens */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                {[
                  { value: '100%', label: 'Inspected Cars' },
                  { value: '500+', label: 'Happy Customers' },
                  { value: 'Fair', label: 'Pricing Always' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={storyInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="bg-background rounded-xl p-4 md:p-6 text-center"
                  >
                    <div className="text-3xl md:text-4xl lg:text-5xl font-black text-primary mb-1">{stat.value}</div>
                    <div className="text-muted-foreground text-xs md:text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section ref={valuesRef} className="section-padding bg-background">
        <div className="sterling-container">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={valuesInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-8 md:mb-12 px-4"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground text-base md:text-lg">What drives us every day</p>
          </motion.div>

          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.9 }}
                  animate={valuesInView ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                  className="value-card"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={valuesInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
                    className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4"
                  >
                    <Icon size={32} className="text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              );
            })}
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
                    nextValuesSlide();
                  } else if (swipe > 500 || offset.x > 100) {
                    prevValuesSlide();
                  }
                }}
                animate={{ x: `-${valuesSlide * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex cursor-grab active:cursor-grabbing"
              >
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <div key={value.title} className="w-full flex-shrink-0 px-2">
                      <div className="value-card">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                          <Icon size={32} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                        <p className="text-muted-foreground text-sm">{value.description}</p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Carousel Controls - Below Card */}
            <div className="flex justify-center items-center gap-4 mt-6 px-4">
              <button
                onClick={prevValuesSlide}
                disabled={valuesSlide === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  valuesSlide === 0
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    : 'bg-card hover:bg-primary hover:text-primary-foreground'
                }`}
                aria-label="Previous value"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {values.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setValuesSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === valuesSlide ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextValuesSlide}
                disabled={valuesSlide === values.length - 1}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  valuesSlide === values.length - 1
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    : 'bg-card hover:bg-primary hover:text-primary-foreground'
                }`}
                aria-label="Next value"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={featuresRef} className="section-padding bg-card md:px-8 px-0">
        <div className="sterling-container md:px-0 px-0">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={featuresInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-8 md:mb-12 px-4"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Why Choose Majesticars</h2>
            <p className="text-muted-foreground text-base md:text-lg">Simple, honest, and stress-free car buying</p>
          </motion.div>

          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                animate={featuresInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                className="feature-card flex gap-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={featuresInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <CheckCircle size={20} className="text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Carousel View */}
          <div className="md:hidden w-full">
            <div className="overflow-hidden px-1">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x * velocity.x;
                  if (swipe < -500 || offset.x < -100) {
                    nextFeaturesSlide();
                  } else if (swipe > 500 || offset.x > 100) {
                    prevFeaturesSlide();
                  }
                }}
                animate={{ x: `-${featuresSlide * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex cursor-grab active:cursor-grabbing"
              >
                {features.map((feature) => (
                  <div key={feature.title} className="w-full flex-shrink-0">
                    <div className="bg-card border border-border rounded-xl md:p-6 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Carousel Controls - Below Card */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={prevFeaturesSlide}
                disabled={featuresSlide === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  featuresSlide === 0
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    : 'bg-card hover:bg-primary hover:text-primary-foreground'
                }`}
                aria-label="Previous feature"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setFeaturesSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === featuresSlide ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextFeaturesSlide}
                disabled={featuresSlide === features.length - 1}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  featuresSlide === features.length - 1
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    : 'bg-card hover:bg-primary hover:text-primary-foreground'
                }`}
                aria-label="Next feature"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
};

export default About;
