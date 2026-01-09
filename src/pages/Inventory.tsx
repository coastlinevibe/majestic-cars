import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import CarCard, { Car } from '@/components/CarCard';
import CompareBar from '@/components/CompareBar';
import CompareModal from '@/components/CompareModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car as CarIcon, X, ChevronDown, Loader2 } from 'lucide-react';
import { carService } from '@/lib/supabase';

const brands = [
  { name: 'BMW', models: ['M8', 'X7', 'M3', 'M5'] },
  { name: 'Mercedes', models: ['AMG GT', 'S-Class', 'G-Wagon', 'AMG C63'] },
  { name: 'Audi', models: ['RS6', 'TT', 'R8', 'RS7'] },
  { name: 'Porsche', models: ['911', 'Cayenne', 'Panamera', 'Taycan'] },
];

const allCars: Car[] = [];

type CarType = 'all' | 'sedan' | 'suv' | 'coupe' | 'hatchback';

const carTypes: { value: CarType; label: string }[] = [
  { value: 'all', label: 'All Cars' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'hatchback', label: 'Hatchback' },
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
  
  // Model selection
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<{ brand: string; model?: string }[]>([]);

  // Load cars from Supabase
  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    setLoading(true);
    try {
      const data = await carService.getAllCars();
      console.log('Loaded cars from Supabase:', data);
      
      // Transform Supabase cars to match CarCard interface
      const transformedCars: Car[] = data.map((car: any) => ({
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
      
      console.log('Transformed cars:', transformedCars);
      setAllCars(transformedCars);
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
  }, [allCars, selectedType, priceRange, yearRange, mileageRange, selectedBrands]);

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
            {/* Sidebar */}
            <aside className="bg-card rounded-xl p-6 shadow-sm h-fit lg:sticky lg:top-28">
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
                  <p className="text-muted-foreground">
                    Explore our premium collection of luxury and performance vehicles
                  </p>
                </div>

                {/* Car Type Filter */}
                <div className="flex flex-wrap gap-3">
                  {carTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`car-type-btn ${selectedType === type.value ? 'active' : ''}`}
                    >
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {getTypeCount(type.value)}
                      </span>
                      <CarIcon size={24} className={selectedType === type.value ? 'text-primary-foreground' : 'text-primary'} />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cars Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading vehicles...</p>
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
                      ? 'No vehicles in inventory yet. Check back soon!' 
                      : 'Try adjusting your filters to find more vehicles.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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
      />

      <CTASection />
      <Footer />
    </div>
  );
};

export default Inventory;
