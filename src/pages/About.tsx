import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { Button } from '@/components/ui/button';
import { Trophy, Heart, Shield, Rocket, CheckCircle } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import aboutHeroImg from '@/assets/about-hero.jpg';

const values = [
  {
    icon: Trophy,
    title: 'Excellence',
    description: 'We maintain the highest standards in everything we do, from vehicle selection to customer service.',
  },
  {
    icon: Heart,
    title: 'Trust',
    description: 'Building lasting relationships through transparency, honesty, and reliable service.',
  },
  {
    icon: Shield,
    title: 'Quality',
    description: 'Every vehicle meets our rigorous inspection standards and comes with comprehensive warranties.',
  },
  {
    icon: Rocket,
    title: 'Innovation',
    description: 'Embracing the latest technology and trends to enhance your automotive experience.',
  },
];

const team = [
  {
    initials: 'JD',
    name: 'James Davidson',
    role: 'Founder & CEO',
    description: 'With over 30 years in the automotive industry, James founded Sterling Motors with a vision to redefine luxury car retail.',
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
  { title: 'Comprehensive Warranties', description: 'All vehicles come with extensive warranty coverage for your peace of mind.' },
  { title: 'Flexible Financing', description: 'Tailored financing solutions to match your budget and preferences.' },
  { title: 'Trade-In Services', description: 'Competitive valuations and seamless trade-in processes.' },
  { title: 'Nationwide Delivery', description: 'Professional delivery service to your preferred location.' },
  { title: 'Expert Maintenance', description: 'Certified technicians and genuine parts for optimal performance.' },
  { title: '24/7 Support', description: 'Round-the-clock customer support for all your automotive needs.' },
];

const About = () => {
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const storyInView = useInView(storyRef, { once: true, margin: '-100px' });
  const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' });
  const teamInView = useInView(teamRef, { once: true, margin: '-100px' });
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });

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
        <div className="relative z-10 sterling-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-5xl md:text-7xl font-black text-card mb-4"
            style={{ fontFamily: 'serif', fontStyle: 'italic' }}
          >
            About Sterling Motors
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-card/80 text-xl"
            style={{ fontStyle: 'italic' }}
          >
            We Sell Memories
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef} className="section-padding bg-card">
        <div className="sterling-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
              animate={storyInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h2 className="text-4xl font-black text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-6">Three decades of automotive excellence</p>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 1995, Sterling Motors began as a small family-owned dealership with a simple mission: to provide exceptional luxury vehicles paired with unparalleled customer service. What started as a passion project has grown into one of South Africa's most trusted premium automotive destinations.
                </p>
                <p>
                  Our commitment to excellence extends beyond just selling cars. We believe in building lasting relationships with our clients, understanding their unique needs, and delivering experiences that exceed expectations. Every vehicle in our showroom is carefully selected and thoroughly inspected to meet our rigorous standards.
                </p>
                <p>
                  Today, Sterling Motors represents the finest in luxury automotive retail, offering an extensive collection of premium brands, comprehensive financing solutions, and award-winning after-sales service.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="space-y-8"
            >
              {[
                { value: '30+', label: 'Years of Excellence' },
                { value: '5000+', label: 'Happy Customers' },
                { value: '15+', label: 'Premium Brands' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={storyInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="text-right"
                >
                  <div className="text-5xl font-black text-primary mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
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
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg">What drives us every day</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </div>
      </section>

      {/* Meet Our Team */}
      <section ref={teamRef} className="section-padding bg-card">
        <div className="sterling-container">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={teamInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg">Passionate professionals dedicated to your success</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 60, filter: 'blur(10px)', scale: 0.9 }}
                animate={teamInView ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                className="team-card"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={teamInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.2, duration: 0.5, type: 'spring' }}
                  className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center mb-4"
                >
                  <span className="text-2xl font-bold text-primary-foreground">{member.initials}</span>
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={featuresRef} className="section-padding bg-background">
        <div className="sterling-container">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={featuresInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-foreground mb-4">Why Choose Sterling Motors</h2>
            <p className="text-muted-foreground text-lg">Your trusted partner in luxury automotive</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
};

export default About;
