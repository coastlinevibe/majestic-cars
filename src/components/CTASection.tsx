import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Shield, Award, Headphones, Car } from 'lucide-react';
import heroImage from '@/assets/hero-car.jpg';

const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
      
      <div className="sterling-container relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Drive Your Dream Car?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of satisfied customers who found their perfect vehicle at Sterling Motors.
            Browse our premium collection today and find your next ride.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
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
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-white/80">
              <Shield size={20} className="text-primary" />
              <span className="text-sm">100% Certified Vehicles</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Award size={20} className="text-primary" />
              <span className="text-sm">Best Price Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Headphones size={20} className="text-primary" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
