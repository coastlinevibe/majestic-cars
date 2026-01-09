import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import CarCard, { Car } from '@/components/CarCard';
import CompareBar from '@/components/CompareBar';
import CompareModal from '@/components/CompareModal';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car as CarIcon, X, ChevronDown, Loader2, SlidersHorizontal, Search, ChevronUp } from 'lucide-react';
import { getCarService } from '@/lib/supabase-lazy';
import { setPageTitle, setPageDescription, addJsonLd, generateCollectionSchema } from '@/lib/seo';

const brands = [
  { name: 'Toyota', models: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Fortuner', 'Yaris'] },
  { name: 'Volkswagen', models: ['Polo', 'Golf', 'Tiguan', 'Jetta', 'Passat'] },
  { name: 'Ford', models: ['Fiesta', 'Focus', 'Ranger', 'EcoSport', 'Everest'] },
  { name: 'Hyundai', models: ['i20', 'i30', 'Tucson', 'Creta', 'Grand i10'] },
  { name: 'Mazda', models: ['Mazda2', 'Mazda3', 'CX-3', 'CX-5', 'CX-30'] },
  { name: 'Honda', models: ['Civic', 'Accord', 'CR-V', 'Jazz', 'HR-V'] },
  { name: 'Nissan', models: ['Micra', 'Almera', 'Qashqai', 'X-Trail', 'NP200'] },
  { name: 'Kia', models: ['Picanto', 'Rio', 'Sportage', 'Seltos', 'Sorento'] },
  { name: 'Renault', models: ['Kwid', 'Sandero', 'Clio', 'Duster', 'Captur'] },
  { name: 'Chevrolet', models: ['Spark', 'Aveo', 'Cruze', 'Trailblazer', 'Utility'] },
];

const allCars: Car[] = [];

type CarType = 'all' | 'sedan' | 'suv' | 'coupe' | 'hatchback' | 'single-cab' | 'double-cab';

const carTypes: { value: CarType; label: string; image: string }[] = [
  { value: 'all', label: 'All Cars', image: '/vehicle types/sedan.svg' },
  { value: 'sedan', label: 'Sedan', image: '/vehicle types/sedan.svg' },
  { value: 'suv', label: 'SUV', image: '/vehicle types/suv.svg' },
  { value: 'coupe', label: 'Coupe', image: '/vehicle types/coupe.svg' },
  { value: 'hatchback', label: 'Hatchback', image: '/vehicle types/hatchback.svg' },
  { value: 'single-cab', label: 'Single Cab', image: '/vehicle types/single_cab.svg' },
  { value: 'double-cab', label: 'Double Cab', image: '/vehicle types/double_cab.svg' },
];

const Inventory = () => {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<CarType>('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });
  const [yearRange, setYearRange] = useState({ min: '', max: '' });
  const [mileageRange, setMileageRange] = useState({ min: '', max: '' });
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(['automatic', 'manual']);
  const [compareCars, setCompareCars] = useState<Car[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVehicleTypes, setShowVehicleTypes] = useState(true);
  const [showMainVehicleTypes, setShowMainVehicleTypes] = useState(true);
  
  // Model selection
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<{ brand: string; model?: string }[]>([]);

  // Lock body scroll when mobile filters are open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  // Load cars from Supabase
  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    setLoading(true);
    try {
      const carService = await getCarService();
      const data = await carService.getAllCars();
      console.log('Loaded cars from Supabase:', data);
      
      // Transform Supabase cars to match CarCard interface
      const transformedCars: Car[] = data.map((car: any) => {
        // Normalize body type to match our type system
        let bodyType: 'sedan' | 'suv' | 'coupe' | 'hatchback' | 'single-cab' | 'double-cab' = 'sedan';
        const rawBodyType = car.body_type?.toLowerCase().replace(/\s+/g, '-') || 'sedan';
        
        if (rawBodyType.includes('single') && rawBodyType.includes('cab')) {
          bodyType = 'single-cab';
        } else if (rawBodyType.includes('double') && rawBodyType.includes('cab')) {
          bodyType = 'double-cab';
        } else if (rawBodyType.includes('suv')) {
          bodyType = 'suv';
        } else if (rawBodyType.includes('coupe')) {
          bodyType = 'coupe';
        } else if (rawBodyType.includes('hatchback')) {
          bodyType = 'hatchback';
        } else if (rawBodyType.includes('sedan')) {
          bodyType = 'sedan';
        }

        return {
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
          type: bodyType,
        };
      });
      
      console.log('Transformed cars:', transformedCars);
      setAllCars(transformedCars);
      
      // Set SEO for inventory page
      setPageTitle('Browse Cars - Quality Second-Hand Vehicles | Majestic Cars');
      setPageDescription(`Browse ${transformedCars.length} quality second-hand cars at Majestic Cars. Find your dream car with fair prices, full inspections, and no hidden surprises.`);
      
      // Add structured data for collection
      if (transformedCars.length > 0) {
        addJsonLd(generateCollectionSchema(
          transformedCars.map(car => ({
            id: car.id,
            name: car.name,
            make: car.name.split(' ')[0],
            model: car.name.split(' ')[1],
            year: car.year,
            price: car.price,
            mileage: car.mileage,
            fuel: car.fuel,
            image: car.image,
            description: car.description,
            location: car.location,
            url: `https://majestic-cars.vercel.app/inventory/${car.id}`,
          }))
        ));
      }
    } catch (error) {
      console.error('Error loading cars:', error);
      setAllCars([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = useMemo(() => {
    console.log('Filtering cars. Total cars:', allCars.length);
    console.log('Selected type:', selectedType);
    console.log('Price range:', priceRange);
    
    const filtered = allCars.filter((car) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          car.name.toLowerCase().includes(query) ||
          car.description.toLowerCase().includes(query) ||
          car.location.toLowerCase().includes(query) ||
          car.fuel.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (selectedType !== 'all' && car.type !== selectedType) {
        console.log(`Car ${car.name} filtered out by type: ${car.type} !== ${selectedType}`);
        return false;
      }
      
      // Brand/model filter
      if (selectedBrands.length > 0) {
        const matchesBrand = selectedBrands.some((selection) => {
          const carBrand = car.name.split(' ')[0];
          if (selection.model) {
            return car.name.toLowerCase().includes(selection.brand.toLowerCase()) &&
                   car.name.toLowerCase().includes(selection.model.toLowerCase());
          }
          return carBrand.toLowerCase() === selection.brand.toLowerCase();
        });
        if (!matchesBrand) return false;
      }
      
      // Price filter
      if (car.price < priceRange.min || car.price > priceRange.max) return false;
      
      if (yearRange.min && car.year < Number(yearRange.min)) return false;
      if (yearRange.max && car.year > Number(yearRange.max)) return false;
      if (mileageRange.min && car.mileage < Number(mileageRange.min)) return false;
      if (mileageRange.max && car.mileage > Number(mileageRange.max)) return false;
      return true;
    });
    
    return filtered;
  }, [allCars, selectedType, priceRange, yearRange, mileageRange, selectedBrands, searchQuery]);

  const getTypeCount = (type: CarType) => {
    if (type === 'all') return allCars.length;
    return allCars.filter((car) => car.type === type).length;
  };

  const handleAddToCompare = (car: Car) => {
    if (compareCars.find((c) => c.id === car.id)) {
      setCompareCars(compareCars.filter((c) => c.id !== car.id));
    } else if (compareCars.length < 4) {
      setCompareCars([...compareCars, car]);
    }
  };

  const handleRemoveFromCompare = (carId: string) => {
    setCompareCars(compareCars.filter((c) => c.id !== carId));
  };

  const isInCompare = (carId: string) => compareCars.some((c) => c.id === carId);

  const handleAddBrand = (brand: string, model?: string) => {
    const exists = selectedBrands.some(
      (s) => s.brand === brand && s.model === model
    );
    if (!exists) {
      setSelectedBrands([...selectedBrands, { brand, model }]);
    }
    setShowModelSelector(false);
  };

  const handleRemoveBrand = (index: number) => {
    setSelectedBrands(selectedBrands.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="sterling-container py-12">
          <div className="grid lg:grid-cols-[312px_1fr] gap-8">
            {/* Sidebar - Hidden on Mobile */}
            <aside className="hidden lg:block bg-card rounded-xl p-6 shadow-sm lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              {/* Search Bar */}
              <div className="filter-section">
                <div className="filter-title">Search</div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="Search cars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Make and Model */}
              <div className="filter-section">
                <div className="filter-title">
                  Make and model
                  {selectedBrands.length > 0 && (
                    <span className="filter-reset" onClick={() => setSelectedBrands([])}>
                      Reset
                    </span>
                  )}
                </div>
                <div className="text-center py-4">
                  <div className="text-2xl font-bold text-foreground mb-1">{selectedBrands.length}</div>
                  <div className="text-muted-foreground text-sm mb-4">
                    {selectedBrands.length === 1 ? 'brand selected' : 'brands selected'}
                  </div>
                </div>
                
                {/* Selected brands */}
                {selectedBrands.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedBrands.map((selection, index) => (
                      <div
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {selection.model ? `${selection.brand} ${selection.model}` : selection.brand}
                        <button
                          onClick={() => handleRemoveBrand(index)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Model Selector */}
                {showModelSelector ? (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Select Brand & Model</span>
                      <button
                        onClick={() => setShowModelSelector(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {brands.map((brand) => (
                      <div key={brand.name} className="bg-secondary rounded-lg p-3">
                        <button
                          onClick={() => handleAddBrand(brand.name)}
                          className="w-full text-left font-semibold text-foreground hover:text-primary transition-colors flex items-center justify-between"
                        >
                          {brand.name}
                          <span className="text-xs text-muted-foreground">All models</span>
                        </button>
                        <div className="mt-2 pl-3 border-l-2 border-border space-y-1">
                          {brand.models.map((model) => (
                            <button
                              key={model}
                              onClick={() => handleAddBrand(brand.name, model)}
                              className="block w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                            >
                              {model}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => setShowModelSelector(true)}>
                    + Add model
                  </Button>
                )}
              </div>

              {/* Price */}
              <div className="filter-section">
                <div className="filter-title">
                  Price
                  <span className="filter-reset" onClick={() => setPriceRange({ min: 0, max: 5000000 })}>
                    Reset
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Min Price</Label>
                      <div className="price-input-group">
                        <Input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                          className="bg-transparent border-0 p-0 h-auto text-sm"
                        />
                        <span className="text-muted-foreground text-xs ml-1">R</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Max Price</Label>
                      <div className="price-input-group">
                        <Input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                          className="bg-transparent border-0 p-0 h-auto text-sm"
                        />
                        <span className="text-muted-foreground text-xs ml-1">R</span>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Year */}
              <div className="filter-section">
                <div className="filter-title">
                  Year
                  <span className="filter-reset" onClick={() => setYearRange({ min: '', max: '' })}>
                    Reset
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Min year</Label>
                    <Input 
                      type="number"
                      placeholder="2020" 
                      value={yearRange.min}
                      onChange={(e) => setYearRange({ ...yearRange, min: e.target.value })}
                      className="bg-secondary" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Max year</Label>
                    <Input 
                      type="number"
                      placeholder="2024" 
                      value={yearRange.max}
                      onChange={(e) => setYearRange({ ...yearRange, max: e.target.value })}
                      className="bg-secondary" 
                    />
                  </div>
                </div>
              </div>

              {/* Mileage */}
              <div className="filter-section">
                <div className="filter-title">
                  Mileage
                  <span className="filter-reset" onClick={() => setMileageRange({ min: '', max: '' })}>Reset</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Min mileage</Label>
                    <div className="price-input-group">
                      <Input
                        type="number"
                        placeholder="0"
                        value={mileageRange.min}
                        onChange={(e) => setMileageRange({ ...mileageRange, min: e.target.value })}
                        className="bg-transparent border-0 p-0 h-auto text-sm"
                      />
                      <span className="text-muted-foreground text-xs ml-1">km</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Max mileage</Label>
                    <div className="price-input-group">
                      <Input
                        type="number"
                        placeholder="100000"
                        value={mileageRange.max}
                        onChange={(e) => setMileageRange({ ...mileageRange, max: e.target.value })}
                        className="bg-transparent border-0 p-0 h-auto text-sm"
                      />
                      <span className="text-muted-foreground text-xs ml-1">km</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transmission */}
              <div className="filter-section">
                <div className="filter-title">
                  Transmission
                  <span className="filter-reset">Reset</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="automatic"
                      checked={selectedTransmissions.includes('automatic')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTransmissions([...selectedTransmissions, 'automatic']);
                        } else {
                          setSelectedTransmissions(selectedTransmissions.filter((t) => t !== 'automatic'));
                        }
                      }}
                    />
                    <label htmlFor="automatic" className="text-sm text-muted-foreground cursor-pointer">
                      Automatic
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="manual"
                      checked={selectedTransmissions.includes('manual')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTransmissions([...selectedTransmissions, 'manual']);
                        } else {
                          setSelectedTransmissions(selectedTransmissions.filter((t) => t !== 'manual'));
                        }
                      }}
                    />
                    <label htmlFor="manual" className="text-sm text-muted-foreground cursor-pointer">
                      Manual
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-foreground">Browse Cars</h1>
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                      {filteredCars.length}
                    </span>
                  </div>
                  <p className="text-muted-foreground hidden md:block">
                    Explore our premium collection of luxury and performance cars
                  </p>
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-6">
                  <Button 
                    onClick={() => setShowMobileFilters(true)}
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <SlidersHorizontal size={20} />
                    More Filters
                  </Button>
                </div>

                {/* Car Type Filter with Collapsible */}
                <div className="border-t border-border pt-6">
                  <button
                    onClick={() => setShowMainVehicleTypes(!showMainVehicleTypes)}
                    className="w-full flex items-center justify-center gap-2 text-foreground hover:text-primary transition-colors mb-4"
                  >
                    <span className="text-base font-semibold">Filter by Car Type</span>
                    {showMainVehicleTypes ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  {showMainVehicleTypes && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                      {carTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setSelectedType(type.value)}
                          className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                            selectedType === type.value
                              ? 'bg-primary border-primary text-primary-foreground shadow-lg'
                              : 'bg-card border-border hover:border-primary/50'
                          }`}
                        >
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                            {getTypeCount(type.value)}
                          </span>
                          <img 
                            src={type.image} 
                            alt={type.label}
                            className={`w-12 h-12 mb-2 object-contain ${
                              selectedType === type.value ? 'brightness-0 invert' : ''
                            }`}
                          />
                          <span className="text-xs font-medium text-center leading-tight">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cars Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading cars...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredCars?.map((car, index) => (
                    <div
                      key={car.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CarCard
                        car={car}
                        onCompare={handleAddToCompare}
                        isInCompare={isInCompare(car.id)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {!loading && (filteredCars?.length === 0 || !filteredCars) && (
                <div className="text-center py-16">
                  <CarIcon size={64} className="mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No cars found</h3>
                  <p className="text-muted-foreground">
                    {(allCars?.length === 0 || !allCars)
                      ? 'No cars in inventory yet. Check back soon!' 
                      : 'Try adjusting your filters to find more cars.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Panel - Slides up from bottom */}
      {showMobileFilters && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
            onClick={() => setShowMobileFilters(false)}
          />
          
          {/* Filter Panel */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden lg:hidden animate-slide-from-bottom">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-xl font-bold text-foreground">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-80px)]">
              {/* Search Bar */}
              <div className="filter-section">
                <div className="filter-title">Search</div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="Search by make, model, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Make and Model */}
              <div className="filter-section">
                <div className="filter-title">
                  Make and model
                  {selectedBrands.length > 0 && (
                    <span className="filter-reset" onClick={() => setSelectedBrands([])}>
                      Reset
                    </span>
                  )}
                </div>
                <div className="text-center py-4">
                  <div className="text-2xl font-bold text-foreground mb-1">{selectedBrands.length}</div>
                  <div className="text-muted-foreground text-sm mb-4">
                    {selectedBrands.length === 1 ? 'brand selected' : 'brands selected'}
                  </div>
                </div>
                
                {/* Selected brands */}
                {selectedBrands.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedBrands.map((selection, index) => (
                      <div
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {selection.model ? `${selection.brand} ${selection.model}` : selection.brand}
                        <button
                          onClick={() => handleRemoveBrand(index)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Model Selector */}
                {showModelSelector ? (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Select Brand & Model</span>
                      <button
                        onClick={() => setShowModelSelector(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {brands.map((brand) => (
                      <div key={brand.name} className="bg-secondary rounded-lg p-3">
                        <button
                          onClick={() => handleAddBrand(brand.name)}
                          className="w-full text-left font-semibold text-foreground hover:text-primary transition-colors flex items-center justify-between"
                        >
                          {brand.name}
                          <span className="text-xs text-muted-foreground">All models</span>
                        </button>
                        <div className="mt-2 pl-3 border-l-2 border-border space-y-1">
                          {brand.models.map((model) => (
                            <button
                              key={model}
                              onClick={() => handleAddBrand(brand.name, model)}
                              className="block w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                            >
                              {model}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => setShowModelSelector(true)}>
                    + Add model
                  </Button>
                )}
              </div>

              {/* Price */}
              <div className="filter-section">
                <div className="filter-title">
                  Price
                  <span className="filter-reset" onClick={() => setPriceRange({ min: 0, max: 5000000 })}>
                    Reset
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Min Price</Label>
                    <div className="price-input-group">
                      <Input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="bg-transparent border-0 p-0 h-auto text-sm"
                      />
                      <span className="text-muted-foreground text-xs ml-1">R</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Max Price</Label>
                    <div className="price-input-group">
                      <Input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="bg-transparent border-0 p-0 h-auto text-sm"
                      />
                      <span className="text-muted-foreground text-xs ml-1">R</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Year */}
              <div className="filter-section">
                <div className="filter-title">
                  Year
                  <span className="filter-reset" onClick={() => setYearRange({ min: '', max: '' })}>
                    Reset
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Min year</Label>
                    <Input 
                      type="number"
                      placeholder="2020" 
                      value={yearRange.min}
                      onChange={(e) => setYearRange({ ...yearRange, min: e.target.value })}
                      className="bg-secondary" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Max year</Label>
                    <Input 
                      type="number"
                      placeholder="2024" 
                      value={yearRange.max}
                      onChange={(e) => setYearRange({ ...yearRange, max: e.target.value })}
                      className="bg-secondary" 
                    />
                  </div>
                </div>
              </div>

              {/* Mileage */}
              <div className="filter-section">
                <div className="filter-title">
                  Mileage
                  <span className="filter-reset" onClick={() => setMileageRange({ min: '', max: '' })}>Reset</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Min mileage</Label>
                    <div className="price-input-group">
                      <Input
                        type="number"
                        placeholder="0"
                        value={mileageRange.min}
                        onChange={(e) => setMileageRange({ ...mileageRange, min: e.target.value })}
                        className="bg-transparent border-0 p-0 h-auto text-sm"
                      />
                      <span className="text-muted-foreground text-xs ml-1">km</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Max mileage</Label>
                    <div className="price-input-group">
                      <Input
                        type="number"
                        placeholder="100000"
                        value={mileageRange.max}
                        onChange={(e) => setMileageRange({ ...mileageRange, max: e.target.value })}
                        className="bg-transparent border-0 p-0 h-auto text-sm"
                      />
                      <span className="text-muted-foreground text-xs ml-1">km</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transmission */}
              <div className="filter-section">
                <div className="filter-title">
                  Transmission
                  <span className="filter-reset">Reset</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="automatic-mobile"
                      checked={selectedTransmissions.includes('automatic')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTransmissions([...selectedTransmissions, 'automatic']);
                        } else {
                          setSelectedTransmissions(selectedTransmissions.filter((t) => t !== 'automatic'));
                        }
                      }}
                    />
                    <label htmlFor="automatic-mobile" className="text-sm text-muted-foreground cursor-pointer">
                      Automatic
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="manual-mobile"
                      checked={selectedTransmissions.includes('manual')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTransmissions([...selectedTransmissions, 'manual']);
                        } else {
                          setSelectedTransmissions(selectedTransmissions.filter((t) => t !== 'manual'));
                        }
                      }}
                    />
                    <label htmlFor="manual-mobile" className="text-sm text-muted-foreground cursor-pointer">
                      Manual
                    </label>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="bg-card pt-4 pb-2 border-t border-border">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply Filters ({filteredCars.length} cars)
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Compare Bar */}
      <CompareBar
        cars={compareCars}
        onRemove={handleRemoveFromCompare}
        onCompare={() => setShowCompareModal(true)}
        onClear={() => setCompareCars([])}
      />

      {/* Compare Modal */}
      <CompareModal
        cars={compareCars}
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        onRemoveCar={handleRemoveFromCompare}
        allAvailableCars={allCars}
      />

      <CTASection />
      <Footer />

      {/* WhatsApp Widget - Hidden when compare bar is visible */}
      <WhatsAppWidget hide={compareCars.length > 0} />
    </div>
  );
};

export default Inventory;
