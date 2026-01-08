import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

import newYorkImg from '@/assets/locations/new-york.jpg';
import losAngelesImg from '@/assets/locations/los-angeles.jpg';
import miamiImg from '@/assets/locations/miami.jpg';

const locations = [
  {
    name: 'New York Showroom',
    address: '123 Motor Lane, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
    image: newYorkImg,
  },
  {
    name: 'Los Angeles Showroom',
    address: '456 Luxury Ave, Los Angeles, CA 90210',
    phone: '+1 (555) 987-6543',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-5PM',
    image: losAngelesImg,
  },
  {
    name: 'Miami Showroom',
    address: '789 Premium Blvd, Miami, FL 33101',
    phone: '+1 (555) 456-7890',
    hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
    image: miamiImg,
  },
];

const LocationsSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="sterling-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-foreground mb-4" style={{ fontStyle: 'italic' }}>
            Our Locations
          </h2>
          <p className="text-muted-foreground text-lg">
            Visit us at one of our showrooms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <div
              key={location.name}
              className="location-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
