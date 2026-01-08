import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { Button } from '@/components/ui/button';
import { Trophy, Heart, Shield, Rocket, CheckCircle } from 'lucide-react';
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${aboutHeroImg})` }}
        />
        <div className="hero-overlay" />
        <div className="relative z-10 sterling-container text-center">
          <h1 className="text-5xl md:text-7xl font-black text-card mb-4" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>
            About Sterling Motors
          </h1>
          <p className="text-card/80 text-xl" style={{ fontStyle: 'italic' }}>
            We Sell Memories
          </p>
        </div>
        <div className="absolute bottom-8 right-8 z-10">
          <span className="px-6 py-3 bg-foreground text-card rounded-lg font-bold text-sm">
            ABOUT US
          </span>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-card">
        <div className="sterling-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
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
            </div>

            <div className="space-y-8">
              {[
                { value: '30+', label: 'Years of Excellence' },
                { value: '5000+', label: 'Happy Customers' },
                { value: '15+', label: 'Premium Brands' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-right animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-5xl font-black text-primary mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-background">
        <div className="sterling-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="value-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="section-padding bg-card">
        <div className="sterling-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg">Passionate professionals dedicated to your success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="team-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">{member.initials}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-background">
        <div className="sterling-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-foreground mb-4">Why Choose Sterling Motors</h2>
            <p className="text-muted-foreground text-lg">Your trusted partner in luxury automotive</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card flex gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
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
