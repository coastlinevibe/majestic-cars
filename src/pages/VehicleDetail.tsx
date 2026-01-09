import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageLightbox from '@/components/ImageLightbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [thumbnailScrollPosition, setThumbnailScrollPosition] = useState(0);
  const [relatedCarsIndex, setRelatedCarsIndex] = useState(0);

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
          title: 'Car not found',
          description: 'The requested car could not be found.',
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
        description: 'Failed to load car details.',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto py-8 px-4 md:px-6">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading car details...</p>
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
          <div className="max-w-7xl mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-16 h-16 text-destructive mb-4" />
              <h2 className="text-2xl font-bold mb-2">Car Not Found</h2>
              <p className="text-muted-foreground mb-6">The car you're looking for doesn't exist.</p>
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

  const nextThumbnail = () => {
    if (thumbnailScrollPosition < images.length - 1) {
      setThumbnailScrollPosition(prev => prev + 1);
    }
  };

  const prevThumbnail = () => {
    if (thumbnailScrollPosition > 0) {
      setThumbnailScrollPosition(prev => prev - 1);
    }
  };

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Inquiry Sent!',
      description: "We'll contact you within 24 hours about this car.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied!',
      description: 'Car link copied to clipboard.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto py-6 md:py-8 px-4 md:px-6 overflow-hidden">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 overflow-x-auto whitespace-nowrap pb-2">
            <Link to="/" className="hover:text-primary transition-colors flex-shrink-0">Home</Link>
            <span className="flex-shrink-0">/</span>
            <Link to="/inventory" className="hover:text-primary transition-colors flex-shrink-0">Inventory</Link>
            <span className="flex-shrink-0">/</span>
            <span className="text-foreground truncate">{car.name}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Gallery & Details */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Image Gallery */}
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
                {/* Main Image */}
                <div className="relative aspect-[4/3] md:aspect-[16/10] bg-secondary overflow-hidden">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${car.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover md:object-contain cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-card/90 rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-md z-10"
                      >
                        <ChevronLeft size={20} className="md:w-6 md:h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-card/90 rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-md z-10"
                      >
                        <ChevronRight size={20} className="md:w-6 md:h-6" />
                      </button>
                    </>
                  )}

                  {/* Fullscreen Button */}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-2 md:top-4 right-2 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-card/90 rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-md z-10"
                  >
                    <Expand size={16} className="md:w-5 md:h-5" />
                  </button>

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-foreground/80 text-card px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="p-3 md:p-4 relative">
                    {/* Thumbnail Container - Max width to show only 4 thumbnails */}
                    <div className="overflow-hidden max-w-[352px] md:max-w-[416px] mx-auto">
                      <div 
                        className="flex gap-2 md:gap-3 transition-transform duration-300"
                        style={{
                          transform: `translateX(-${thumbnailScrollPosition * 88}px)`
                        }}
                      >
                        {images.map((img: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              idx === currentImageIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Thumbnail Navigation Arrows - Show if more than 4 images */}
                    {images.length > 4 && (
                      <>
                        {thumbnailScrollPosition > 0 && (
                          <button
                            onClick={prevThumbnail}
                            className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-card/90 rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-md z-10"
                          >
                            <ChevronLeft size={16} />
                          </button>
                        )}
                        {thumbnailScrollPosition < images.length - 4 && (
                          <button
                            onClick={nextThumbnail}
                            className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-card/90 rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-md z-10"
                          >
                            <ChevronRight size={16} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Title & Quick Actions */}
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 md:mb-6">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2 break-words">{car.name}</h1>
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm md:text-base">
                      <MapPin size={16} className="md:w-5 md:h-5 flex-shrink-0" />
                      <span className="truncate">{car.location}</span>
                    </div>
                  </div>
                  <div className="sm:text-right flex-shrink-0">
                    <div className="text-2xl md:text-3xl font-black text-primary whitespace-nowrap">{formatPrice(car.price)}</div>
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="spec-item min-w-0">
                    <Calendar size={18} className="text-muted-foreground md:w-5 md:h-5 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium truncate">{car.year}</span>
                    <span className="text-xs text-muted-foreground">Year</span>
                  </div>
                  <div className="spec-item min-w-0">
                    <Gauge size={18} className="text-muted-foreground md:w-5 md:h-5 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium truncate">{car.mileage.toLocaleString()} km</span>
                    <span className="text-xs text-muted-foreground">Mileage</span>
                  </div>
                  <div className="spec-item min-w-0">
                    <Fuel size={18} className="text-muted-foreground md:w-5 md:h-5 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium truncate">{car.fuel}</span>
                    <span className="text-xs text-muted-foreground">Fuel Type</span>
                  </div>
                  <div className="spec-item min-w-0">
                    <Settings size={18} className="text-muted-foreground md:w-5 md:h-5 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium truncate">Automatic</span>
                    <span className="text-xs text-muted-foreground">Transmission</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1" size="lg">
                    <Phone className="mr-2 flex-shrink-0" size={18} />
                    <span className="truncate">Call Dealer</span>
                  </Button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`w-12 h-12 flex-shrink-0 border-2 rounded-lg flex items-center justify-center transition-all ${
                      isWishlisted
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-12 h-12 flex-shrink-0 border-2 border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm overflow-hidden">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">Description</h2>
                <div className="text-muted-foreground text-sm md:text-base whitespace-pre-line leading-relaxed break-words">
                  {description}
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm overflow-hidden">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {specs.map((spec: any, idx: number) => (
                    <div key={idx} className="p-3 md:p-4 bg-secondary rounded-xl min-w-0 overflow-hidden">
                      <div className="text-muted-foreground text-xs mb-1 truncate">{spec.label}</div>
                      <div className="font-semibold text-foreground text-sm md:text-base break-words">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm overflow-hidden">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Features & Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 min-w-0 overflow-hidden">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-primary" />
                      </div>
                      <span className="text-muted-foreground text-sm break-words flex-1">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Finance */}
            <div className="space-y-4 md:space-y-6 lg:sticky lg:top-28 lg:self-start overflow-hidden">
              {/* Dealer Contact */}
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm overflow-hidden">
                <h3 className="text-base md:text-lg font-bold text-foreground mb-3 md:mb-4">Contact Dealer</h3>
                
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-secondary rounded-xl mb-4 md:mb-6 overflow-hidden">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-base md:text-lg">MC</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-foreground text-sm md:text-base truncate">Majesticars</div>
                    <div className="text-muted-foreground text-xs md:text-sm truncate">Authorized Dealer</div>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3 text-muted-foreground text-sm md:text-base min-w-0 overflow-hidden">
                    <Phone size={16} className="text-primary md:w-5 md:h-5 flex-shrink-0" />
                    <span className="truncate">060 857 9146</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-muted-foreground min-w-0 overflow-hidden">
                    <Mail size={16} className="text-primary md:w-5 md:h-5 flex-shrink-0" />
                    <span className="break-all text-xs md:text-sm">majesticcarssinoville@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-muted-foreground text-sm md:text-base min-w-0 overflow-hidden">
                    <Clock size={16} className="text-primary md:w-5 md:h-5 flex-shrink-0" />
                    <span className="truncate">Mon-Fri: 9AM - 6PM</span>
                  </div>
                </div>

                {/* Inquiry Form */}
                <form onSubmit={handleInquiry} className="space-y-4">
                  <div>
                    <Label className="text-sm mb-1.5 block">Your Name</Label>
                    <Input placeholder="John Doe" className="bg-secondary w-full" required />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Phone Number</Label>
                    <Input placeholder="060 857 9146" className="bg-secondary w-full" required />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Email</Label>
                    <Input type="email" placeholder="john@example.com" className="bg-secondary w-full" required />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Message</Label>
                    <Textarea
                      placeholder={`I'm interested in the ${car.name}...`}
                      className="bg-secondary resize-none w-full"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Send Inquiry
                  </Button>
                </form>
              </div>

              {/* Trust Badges */}
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm overflow-hidden">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield size={18} className="text-primary md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground text-xs md:text-sm truncate">Certified Car</div>
                      <div className="text-muted-foreground text-xs truncate">150-point inspection passed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap size={18} className="text-primary md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground text-xs md:text-sm truncate">Extended Warranty</div>
                      <div className="text-muted-foreground text-xs truncate">Up to 5 years available</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CarIcon size={18} className="text-primary md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground text-xs md:text-sm truncate">Trade-In Welcome</div>
                      <div className="text-muted-foreground text-xs truncate">Get instant valuation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Vehicles */}
          <section className="mt-12 md:mt-16 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl md:text-2xl font-black text-foreground truncate">Similar Cars</h2>
                <p className="text-sm md:text-base text-muted-foreground truncate">You might also be interested in</p>
              </div>
              <Button variant="outline" asChild className="flex-shrink-0 w-full sm:w-auto">
                <Link to="/inventory">View All</Link>
              </Button>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedCars.map((relatedCar, idx) => (
                <div key={relatedCar.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <CarCard car={relatedCar} />
                </div>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${relatedCarsIndex * 100}%)` }}
                >
                  {relatedCars.map((relatedCar) => (
                    <div key={relatedCar.id} className="w-full flex-shrink-0 px-1">
                      <CarCard car={relatedCar} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows Below Card */}
              {relatedCars.length > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => setRelatedCarsIndex(prev => Math.max(0, prev - 1))}
                    disabled={relatedCarsIndex === 0}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                      relatedCarsIndex === 0
                        ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        : 'bg-card hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* Dot Indicators */}
                  <div className="flex gap-2">
                    {relatedCars.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setRelatedCarsIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === relatedCarsIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setRelatedCarsIndex(prev => Math.min(relatedCars.length - 1, prev + 1))}
                    disabled={relatedCarsIndex === relatedCars.length - 1}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                      relatedCarsIndex === relatedCars.length - 1
                        ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        : 'bg-card hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
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
