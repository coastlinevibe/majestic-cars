import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
type PriceMode = 'price' | 'finance';
type CreditScore = 'excellent' | 'good' | 'fair' | 'poor';

const carTypes: { value: CarType; label: string }[] = [
  { value: 'all', label: 'All Cars' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'hatchback', label: 'Hatchback' },
];

const creditScoreRates: Record<CreditScore, number> = {
  excellent: 7.5,
  good: 9.5,
  fair: 12.5,
  poor: 16.5,
};

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
  
  // Price/Finance mode
  const [priceMode, setPriceMode] = useState<PriceMode>('price');
  const [financeSettings, setFinanceSettings] = useState({
    monthlyMin: '',
    monthlyMax: '',
    downPayment: '10',
    loanTerm: '60',
    creditScore: 'good' as CreditScore,
  });

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

  // Calculate monthly payment range based on price and finance settings
  const calculateMonthlyPayment = (price: number) => {
    const downPaymentPercent = Number(financeSettings.downPayment) / 100;
    const loanAmount = price * (1 - downPaymentPercent);
    const monthlyRate = creditScoreRates[financeSettings.creditScore] / 100 / 12;
    const months = Number(financeSettings.loanTerm);
    const monthly = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(monthly);
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
      
      // Price or finance filter
      if (priceMode === 'price') {
        if (car.price < priceRange.min || car.price > priceRange.max) return false;
      } else {
        const monthlyPayment = calculateMonthlyPayment(car.price);
        const minMonthly = financeSettings.monthlyMin ? Number(financeSettings.monthlyMin) : 0;
        const maxMonthly = financeSettings.monthlyMax ? Number(financeSettings.monthlyMax) : Infinity;
        if (monthlyPayment < minMonthly || monthlyPayment > maxMonthly) return false;
      }
      
      if (yearRange.min && car.year < Number(yearRange.min)) return false;
      if (yearRange.max && car.year > Number(yearRange.max)) return false;
      if (mileageRange.min && car.mileage < Number(mileageRange.min)) return false;
      if (mileageRange.max && car.mileage > Number(mileageRange.max)) return false;
      return true;
    });
    
    return filtered;
  }, [allCars, selectedType, priceRange, yearRange, mileageRange, selectedBrands, priceMode, financeSettings]);

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

  const resetPriceFilter = () => {
    if (priceMode === 'price') {
      setPriceRange({ min: 0, max: 5000000 });
    } else {
      setFinanceSettings({
        ...financeSettings,
        monthlyMin: '',
        monthlyMax: '',
      });
    }
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

              {/* Price / Finance */}
              <div className="filter-section">
                <div className="filter-title">
                  {priceMode === 'price' ? 'Price' : 'Monthly Payment'}
                  <span className="filter-reset" onClick={resetPriceFilter}>
                    Reset
                  </span>
                </div>
                <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-4">
                  <button 
                    onClick={() => setPriceMode('price')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                      priceMode === 'price' 
                        ? 'bg-card text-primary shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Price
                  </button>
                  <button 
                    onClick={() => setPriceMode('finance')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                      priceMode === 'finance' 
                        ? 'bg-card text-primary shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Finance
                  </button>
                </div>
                
                {priceMode === 'price' ? (
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
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    {/* Monthly payment range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Min Monthly</Label>
                        <div className="price-input-group">
                          <Input
                            type="number"
                            placeholder="5000"
                            value={financeSettings.monthlyMin}
                            onChange={(e) => setFinanceSettings({ ...financeSettings, monthlyMin: e.target.value })}
                            className="bg-transparent border-0 p-0 h-auto text-sm"
                          />
                          <span className="text-muted-foreground text-xs ml-1">R/mo</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Max Monthly</Label>
                        <div className="price-input-group">
                          <Input
                            type="number"
                            placeholder="50000"
                            value={financeSettings.monthlyMax}
                            onChange={(e) => setFinanceSettings({ ...financeSettings, monthlyMax: e.target.value })}
                            className="bg-transparent border-0 p-0 h-auto text-sm"
                          />
                          <span className="text-muted-foreground text-xs ml-1">R/mo</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Down payment */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Down Payment</Label>
                      <Select
                        value={financeSettings.downPayment}
                        onValueChange={(value) => setFinanceSettings({ ...financeSettings, downPayment: value })}
                      >
                        <SelectTrigger className="bg-secondary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0% (No deposit)</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                          <SelectItem value="30">30%</SelectItem>
                          <SelectItem value="40">40%</SelectItem>
                          <SelectItem value="50">50%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Loan term */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Loan Term</Label>
                      <Select
                        value={financeSettings.loanTerm}
                        onValueChange={(value) => setFinanceSettings({ ...financeSettings, loanTerm: value })}
                      >
                        <SelectTrigger className="bg-secondary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 months (2 years)</SelectItem>
                          <SelectItem value="36">36 months (3 years)</SelectItem>
                          <SelectItem value="48">48 months (4 years)</SelectItem>
                          <SelectItem value="60">60 months (5 years)</SelectItem>
                          <SelectItem value="72">72 months (6 years)</SelectItem>
                          <SelectItem value="84">84 months (7 years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Credit score */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Credit Score</Label>
                      <Select
                        value={financeSettings.creditScore}
                        onValueChange={(value: CreditScore) => setFinanceSettings({ ...financeSettings, creditScore: value })}
                      >
                        <SelectTrigger className="bg-secondary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">
                            <div className="flex items-center justify-between w-full">
                              <span>Excellent (720+)</span>
                              <span className="text-xs text-green-500 ml-2">~7.5% APR</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="good">
                            <div className="flex items-center justify-between w-full">
                              <span>Good (680-719)</span>
                              <span className="text-xs text-blue-500 ml-2">~9.5% APR</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="fair">
                            <div className="flex items-center justify-between w-full">
                              <span>Fair (620-679)</span>
                              <span className="text-xs text-yellow-500 ml-2">~12.5% APR</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="poor">
                            <div className="flex items-center justify-between w-full">
                              <span>Poor (below 620)</span>
                              <span className="text-xs text-red-500 ml-2">~16.5% APR</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="bg-primary/5 rounded-lg p-3 text-xs text-muted-foreground">
                      <strong className="text-foreground">Estimated rates based on credit score.</strong> Actual rates may vary based on lender and individual circumstances.
                    </div>
                  </div>
                )}
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
                        financeMode={priceMode === 'finance'}
                        monthlyPayment={priceMode === 'finance' ? calculateMonthlyPayment(car.price) : undefined}
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

      <Footer />
    </div>
  );
};

export default Inventory;
