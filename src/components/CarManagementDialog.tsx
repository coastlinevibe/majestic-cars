import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Car, carService } from '@/lib/supabase';
import { Loader2, Plus, X, Sparkles } from 'lucide-react';

interface CarManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car?: Car | null;
  onSuccess: () => void;
}

const CarManagementDialog = ({ open, onOpenChange, car, onSuccess }: CarManagementDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState('');

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    body_type: '',
    mileage: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    drive_type: '',
    engine: '',
    color: '',
    interior: '',
    seats: 5,
    location: '',
    description: '',
    status: 'available',
  });

  useEffect(() => {
    if (car) {
      setFormData({
        make: car.make || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        price: car.price || 0,
        body_type: car.body_type || '',
        mileage: car.mileage || 0,
        fuel_type: car.fuel_type || 'Petrol',
        transmission: car.transmission || 'Automatic',
        drive_type: car.drive_type || '',
        engine: car.engine || '',
        color: car.color || '',
        interior: car.interior || '',
        seats: car.seats || 5,
        location: car.location || '',
        description: car.description || '',
        status: car.status || 'available',
      });
      setFeatures(car.features || []);
      setImages(car.images || []);
    } else {
      // Reset form for new car
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        body_type: '',
        mileage: 0,
        fuel_type: 'Petrol',
        transmission: 'Automatic',
        drive_type: '',
        engine: '',
        color: '',
        interior: '',
        seats: 5,
        location: '',
        description: '',
        status: 'available',
      });
      setFeatures([]);
      setImages([]);
    }
  }, [car, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const carData = {
        ...formData,
        features,
        images,
        specs: {
          make: formData.make,
          model: formData.model,
          year: formData.year,
          body_type: formData.body_type,
          mileage: formData.mileage,
          fuel_type: formData.fuel_type,
          transmission: formData.transmission,
          drive_type: formData.drive_type,
          engine: formData.engine,
          color: formData.color,
          interior: formData.interior,
        },
        created_by: 'admin', // TODO: Replace with actual user ID from auth
      };

      if (car) {
        await carService.updateCar(car.id, carData);
        toast({
          title: 'Success!',
          description: 'Car updated successfully.',
        });
      } else {
        await carService.createCar(carData);
        toast({
          title: 'Success!',
          description: 'Car added successfully.',
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save car.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const autoFillForm = () => {
    const sampleData = {
      make: 'BMW',
      model: 'M4 Competition',
      year: 2024,
      price: 1450000,
      body_type: 'Coupe',
      mileage: 5000,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      drive_type: 'Rear-Wheel Drive',
      engine: '3.0L Inline-6 Twin-Turbo',
      color: 'Sao Paulo Yellow',
      interior: 'Black Merino Leather',
      seats: 4,
      location: 'Johannesburg, South Africa',
      description: 'Experience the ultimate driving machine with this stunning BMW M4 Competition. This high-performance coupe combines breathtaking power with sophisticated luxury, creating an unparalleled driving experience.\n\nUnder the hood lies a 3.0-liter inline-6 twin-turbo engine producing an exhilarating 503 horsepower. The M xDrive all-wheel-drive system ensures optimal traction in all conditions.\n\nThis particular example has been meticulously maintained and comes with a complete service history from authorized BMW dealers.',
      status: 'available',
    };

    const sampleFeatures = [
      'M Carbon Ceramic Brakes',
      'Adaptive M Suspension',
      'M Sport Exhaust',
      'Head-Up Display',
      'Harman Kardon Sound System',
      'LED Headlights',
      'Parking Assistant',
      'Driving Assistant Professional',
      'M Carbon Fiber Trim',
      'Heated & Ventilated Seats',
      'Wireless Charging',
      'Apple CarPlay & Android Auto',
    ];

    const sampleImages = [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
    ];

    setFormData(sampleData);
    setFeatures(sampleFeatures);
    setImages(sampleImages);

    toast({
      title: 'Form Auto-Filled!',
      description: 'Sample data has been loaded. You can edit any field before saving.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{car ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
              <DialogDescription>
                {car ? 'Update vehicle information' : 'Enter vehicle details to add to inventory'}
              </DialogDescription>
            </div>
            {!car && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={autoFillForm}
                className="ml-4"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Auto-Fill
              </Button>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (R) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="body_type">Body Type</Label>
                <Input
                  id="body_type"
                  value={formData.body_type}
                  onChange={(e) => setFormData({ ...formData, body_type: e.target.value })}
                  placeholder="e.g., Coupe, Sedan, SUV"
                />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Select value={formData.fuel_type} onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., New York, USA"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Performance Specs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Performance Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="engine">Engine</Label>
                <Input
                  id="engine"
                  value={formData.engine}
                  onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                  placeholder="e.g., 4.4L V8 Twin-Turbo"
                />
              </div>
              <div>
                <Label htmlFor="drive_type">Drive Type</Label>
                <Input
                  id="drive_type"
                  value={formData.drive_type}
                  onChange={(e) => setFormData({ ...formData, drive_type: e.target.value })}
                  placeholder="e.g., All-Wheel Drive"
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Appearance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">Exterior Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="interior">Interior</Label>
                <Input
                  id="interior"
                  value={formData.interior}
                  onChange={(e) => setFormData({ ...formData, interior: e.target.value })}
                  placeholder="e.g., Merino Leather Black"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Enter detailed vehicle description..."
            />
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Features</h3>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm">
                  {feature}
                  <button type="button" onClick={() => removeFeature(index)} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Images</h3>
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Add image URL..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
              <Button type="button" onClick={addImage} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img src={image} alt={`Car ${index + 1}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {car ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CarManagementDialog;
