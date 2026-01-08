import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageLightbox from '@/components/ImageLightbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import CarCard, { Car } from '@/components/CarCard';
import { carService } from '@/lib/supabase';
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Settings,
  Zap,
  Shield,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  Check,
  Car as CarIcon,
  Expand,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// Remove hardcoded vehicle data - now loaded from Supabase

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);
  const [relatedCars, setRelatedCars] = useState<Car[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [loanTerm, setLoanTerm] = useState('72');
  const [deposit, setDeposit] = useState(0);
  const [interestRate] = useState(11.5);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Load vehicle data from Supabase
  useEffect(() => {
    if (id) {
      console.log('Loading vehicle with ID:', id);
      loadVehicle(id);
    }
  }, [id]);

  const loadVehicle = async (carId: string) => {
    console.log('loadVehicle called with ID:', carId);
    setLoading(true);
    try {
      const carData = await carService.getCarById(carId);
      console.log('Loaded car data:', carData);
      
      if (!carData) {
        toast({
          title: 'Vehicle not found',
          description: 'The requested vehicle could not be found.',
          variant: 'destructive',
        });
        navigate('/inventory');
        return;
      }

      // Transform Supabase data to match component structure
      const transformedVehicle = {
        car: {
          id: carData.id,
          name: `${carData.make} ${carData.model}`,
          price: carData.price,
          year: carData.year,
          fuel: carData.fuel_type || 'Petrol',
          mileage: carData.mileage || 0,
          seats: carData.seats || 5,
          location: carData.location || 'Location TBD',
          description: carData.description || '',
          image: carData.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
          type: (carData.body_type?.toLowerCase() || 'sedan') as 'sedan' | 'suv' | 'coupe' | 'hatchback',
        },
        images: carData.images && carData.images.length > 0 
          ? carData.images 
          : ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
        specs: [
          { label: 'Make', value: carData.make || 'N/A' },
          { label: 'Model', value: carData.model || 'N/A' },
          { label: 'Year', value: carData.year?.toString() || 'N/A' },
          { label: 'Body Type', value: carData.body_type || 'N/A' },
          { label: 'Mileage', value: `${carData.mileage?.toLocaleString() || 0} km` },
          { label: 'Fuel Type', value: carData.fuel_type || 'N/A' },
          { label: 'Transmission', value: carData.transmission || 'N/A' },
          { label: 'Drive Type', value: carData.drive_type || 'N/A' },
          { label: 'Engine', value: carData.engine || 'N/A' },
          { label: 'Power', value: carData.power || 'N/A' },
          { label: 'Torque', value: carData.torque || 'N/A' },
          { label: '0-100 km/h', value: carData.acceleration || 'N/A' },
          { label: 'Top Speed', value: carData.top_speed || 'N/A' },
          { label: 'Color', value: carData.color || 'N/A' },
          { label: 'Interior', value: carData.interior || 'N/A' },
          { label: 'VIN', value: carData.vin || 'N/A' },
        ],
        features: carData.features || [],
        description: carData.description || 'No description available.',
      };

      setVehicle(transformedVehicle);
      
      // Load related cars
      loadRelatedCars(carData.make);
    } catch (error) {
      console.error('Error loading vehicle:', error);
      toast({
        title: 'Error',
        description: 'Failed to load vehicle details.',
        variant: 'destructive',
      });
      navigate('/inventory');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedCars = async (make: string) => {
    try {
      const allCars = await carService.getAllCars();
      // Filter cars by same make, exclude current car, limit to 3
      const related = allCars
        .filter((c: any) => c.make === make && c.id !== id)
        .slice(0, 3)
        .map((car: any) => ({
          id: car.id,
          name: `${car.make} ${car.model}`,
          price: car.price,
          year: car.year,
          fuel: car.fuel_type || 'Petrol',
          mileage: car.mileage || 0,
          seats: car.seats || 5,
          location: car.location || 'Location TBD',
          description: car.description || '',
          image: car.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
          type: (car.body_type?.toLowerCase() || 'sedan') as 'sedan' | 'suv' | 'coupe' | 'hatchback',
        }));
      console.log('Related cars:', related);
      setRelatedCars(related);
    } catch (error) {
      console.error('Error loading related cars:', error);
      setRelatedCars([]);
    }
  };

  // Calculate monthly payment
  useEffect(() => {
    if (vehicle) {
      const principal = vehicle.car.price - deposit;
      const monthlyRate = interestRate / 100 / 12;
      const months = parseInt(loanTerm);
      
      if (monthlyRate > 0 && principal > 0) {
        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        setMonthlyPayment(Math.round(payment));
      }
    }
  }, [vehicle, deposit, loanTerm, interestRate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <div className="sterling-container py-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading vehicle details...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <div className="sterling-container py-8">
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-16 h-16 text-destructive mb-4" />
              <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
              <p className="text-muted-foreground mb-6">The vehicle you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/inventory')}>
                Back to Inventory
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { car, images, specs, features, description } = vehicle;

  const formatPrice = (price: number) => `R ${price.toLocaleString()}`;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Inquiry Sent!',
      description: "We'll contact you within 24 hours about this vehicle.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied!',
      description: 'Vehicle link copied to clipboard.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <div className="sterling-container py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/inventory" className="hover:text-primary transition-colors">Inventory</Link>
            <span>/</span>
            <span className="text-foreground">{car.name}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Gallery & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
                {/* Main Image */}
                <div className="relative aspect-[16/10] bg-secondary">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${car.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/90 rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-md"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/90 rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-md"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Fullscreen Button */}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-4 right-4 w-10 h-10 bg-card/90 rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-md"
                  >
                    <Expand size={18} />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/80 text-card px-4 py-2 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="p-4 flex gap-3 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Quick Actions */}
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-black text-foreground mb-2">{car.name}</h1>
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <MapPin size={18} />
                      <span>{car.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-primary">{formatPrice(car.price)}</div>
                    <div className="text-muted-foreground text-sm">
                      Est. {formatPrice(monthlyPayment)}/month
                    </div>
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="spec-item">
                    <Calendar size={20} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{car.year}</span>
                    <span className="text-xs text-muted-foreground">Year</span>
                  </div>
                  <div className="spec-item">
                    <Gauge size={20} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{car.mileage.toLocaleString()} km</span>
                    <span className="text-xs text-muted-foreground">Mileage</span>
                  </div>
                  <div className="spec-item">
                    <Fuel size={20} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{car.fuel}</span>
                    <span className="text-xs text-muted-foreground">Fuel Type</span>
                  </div>
                  <div className="spec-item">
                    <Settings size={20} className="text-muted-foreground" />
                    <span className="text-sm font-medium">Automatic</span>
                    <span className="text-xs text-muted-foreground">Transmission</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1" size="lg">
                    <Phone className="mr-2" size={18} />
                    Call Dealer
                  </Button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-all ${
                      isWishlisted
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-12 h-12 border-2 border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {description}
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {specs.map((spec, idx) => (
                    <div key={idx} className="p-4 bg-secondary rounded-xl">
                      <div className="text-muted-foreground text-xs mb-1">{spec.label}</div>
                      <div className="font-semibold text-foreground">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6">Features & Options</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-primary" />
                      </div>
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Finance */}
            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {/* Dealer Contact */}
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">Contact Dealer</h3>
                
                <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl mb-6">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">SM</span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Sterling Motors</div>
                    <div className="text-muted-foreground text-sm">Authorized Dealer</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone size={18} className="text-primary" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail size={18} className="text-primary" />
                    <span>sales@sterlingmotors.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock size={18} className="text-primary" />
                    <span>Mon-Fri: 9AM - 6PM</span>
                  </div>
                </div>

                {/* Inquiry Form */}
                <form onSubmit={handleInquiry} className="space-y-4">
                  <div>
                    <Label className="text-sm mb-1.5 block">Your Name</Label>
                    <Input placeholder="John Doe" className="bg-secondary" required />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Phone Number</Label>
                    <Input placeholder="+1 (555) 000-0000" className="bg-secondary" required />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Email</Label>
                    <Input type="email" placeholder="john@example.com" className="bg-secondary" required />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Message</Label>
                    <Textarea
                      placeholder={`I'm interested in the ${car.name}...`}
                      className="bg-secondary resize-none"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Send Inquiry
                  </Button>
                </form>
              </div>

              {/* Finance Calculator */}
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">Finance Calculator</h3>
                
                <div className="text-center p-4 bg-primary/10 rounded-xl mb-6">
                  <div className="text-muted-foreground text-sm mb-1">Estimated Monthly Payment</div>
                  <div className="text-3xl font-black text-primary">{formatPrice(monthlyPayment)}</div>
                  <div className="text-muted-foreground text-xs mt-1">Based on {interestRate}% interest</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm mb-1.5 block">Vehicle Price</Label>
                    <div className="price-input-group">
                      <span className="text-foreground font-semibold">{formatPrice(car.price)}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Deposit Amount</Label>
                    <Input
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="bg-secondary"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Loan Term</Label>
                    <Select value={loanTerm} onValueChange={setLoanTerm}>
                      <SelectTrigger className="bg-secondary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                        <SelectItem value="72">72 months</SelectItem>
                        <SelectItem value="84">84 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Apply for Finance
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Shield size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">Certified Vehicle</div>
                      <div className="text-muted-foreground text-xs">150-point inspection passed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">Extended Warranty</div>
                      <div className="text-muted-foreground text-xs">Up to 5 years available</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CarIcon size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">Trade-In Welcome</div>
                      <div className="text-muted-foreground text-xs">Get instant valuation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Vehicles */}
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-foreground">Similar Vehicles</h2>
                <p className="text-muted-foreground">You might also be interested in</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/inventory">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedCars.map((relatedCar, idx) => (
                <div key={relatedCar.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <CarCard car={relatedCar} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        currentIndex={currentImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={setCurrentImageIndex}
        altText={car.name}
      />

      <Footer />
    </div>
  );
};

export default VehicleDetail;
