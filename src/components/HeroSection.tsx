import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-car.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="hero-overlay" />

      <div className="relative z-10 sterling-container w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-32">
          {/* Left Content */}
          <div className="animate-slide-up">
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold mb-6">
              Premium Automotive Excellence
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-card mb-6 leading-tight">
              Find Your
              <span className="block text-gradient-orange">Dream Car</span>
            </h1>
            <p className="text-card/80 text-lg mb-8 max-w-lg">
              Discover South Africa's finest collection of luxury vehicles. 
              Premium quality, exceptional service, unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/inventory">
                  Browse Inventory
                  <ChevronRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-card/30 text-card hover:bg-card/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-8 mt-12">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-card/70 text-sm">100% Certified Vehicles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-card/70 text-sm">Best Price Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Glass Navigation */}
          <div className="hidden lg:block">
            <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <nav className="space-y-4 mb-8">
                {['Inventory', 'About Us', 'Services', 'Contact'].map((item, idx) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-card/10 transition-colors text-card group"
                    style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
                  >
                    <span className="font-medium">{item}</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </nav>

              {/* Contact Info */}
              <div className="border-t border-card/20 pt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto bg-primary rounded-lg flex items-center justify-center mb-2">
                      <Mail size={18} className="text-primary-foreground" />
                    </div>
                    <p className="text-card/60 text-xs">Email</p>
                    <p className="text-card text-xs font-medium truncate">info@sterlingmotors.com</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto bg-primary rounded-lg flex items-center justify-center mb-2">
                      <Phone size={18} className="text-primary-foreground" />
                    </div>
                    <p className="text-card/60 text-xs">Phone</p>
                    <p className="text-card text-xs font-medium">+1 234 567 890</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto bg-primary rounded-lg flex items-center justify-center mb-2">
                      <MapPin size={18} className="text-primary-foreground" />
                    </div>
                    <p className="text-card/60 text-xs">Address</p>
                    <p className="text-card text-xs font-medium truncate">123 Motor Lane</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
