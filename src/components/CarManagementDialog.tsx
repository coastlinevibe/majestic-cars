import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Car, carService } from '@/lib/supabase';
import { Loader2, Plus, X, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CarManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car?: Car | null;
  onSuccess: () => void;
}

const CarManagementDialog = ({ open, onOpenChange, car, onSuccess }: CarManagementDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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
    vin: '',
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
        vin: car.vin || '',
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
        vin: '',
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

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  const moveImageUp = (index: number) => {
    if (index > 0) {
      moveImage(index, index - 1);
    }
  };

  const moveImageDown = (index: number) => {
    if (index < images.length - 1) {
      moveImage(index, index + 1);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Move the dragged item to the new position
    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    
    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleCancel = () => {
    // Check if form has any data
    const hasData = formData.make || formData.model || formData.price > 0 || 
                    images.length > 0 || features.length > 0 || formData.description;
    
    if (hasData) {
      setShowCancelConfirm(true);
    } else {
      onOpenChange(false);
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onOpenChange(false);
  };

  // Auto-capitalize first letter of each word
  const capitalizeWords = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if Make and Model fields are filled
    if (!formData.make || formData.make.trim() === '' || !formData.model || formData.model.trim() === '') {
      toast({
        title: 'Make and Model Required',
        description: 'Please enter both Make and Model before uploading images.',
        variant: 'destructive',
      });
      e.target.value = '';
      return;
    }

    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      // Create folder name from Make and Model (sanitize for file system)
      const folderName = `${formData.make.trim()}_${formData.model.trim()}`.replace(/[^a-zA-Z0-9-_]/g, '_');

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        // Store in folder: Make_Model/filename
        const filePath = `${folderName}/${fileName}`;

        // Upload to Supabase Storage
        const uploadResult = await carService.uploadImage(filePath, file);

        if (uploadResult) {
          // Get public URL
          const { data: { publicUrl } } = carService.getImageUrl(filePath);
          uploadedUrls.push(publicUrl);
        }
      }

      setImages([...images, ...uploadedUrls]);
      toast({
        title: 'Success!',
        description: `${uploadedUrls.length} image(s) uploaded to ${folderName.replace(/_/g, ' ')} folder.`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload images.',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
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
      vin: 'WBS8M9C51P7D12345',
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
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
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
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: capitalizeWords(e.target.value) })}
                  placeholder="e.g., Audi"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: capitalizeWords(e.target.value) })}
                  placeholder="e.g., A4"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price (R)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="body_type">Body Type</Label>
                <Input
                  id="body_type"
                  value={formData.body_type}
                  onChange={(e) => setFormData({ ...formData, body_type: capitalizeWords(e.target.value) })}
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
                  onChange={(e) => setFormData({ ...formData, location: capitalizeWords(e.target.value) })}
                  placeholder="e.g., Pretoria, South Africa"
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
                  onChange={(e) => setFormData({ ...formData, engine: capitalizeWords(e.target.value) })}
                  placeholder="e.g., 4.4L V8 Twin-Turbo"
                />
              </div>
              <div>
                <Label htmlFor="drive_type">Drive Type</Label>
                <Input
                  id="drive_type"
                  value={formData.drive_type}
                  onChange={(e) => setFormData({ ...formData, drive_type: capitalizeWords(e.target.value) })}
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
                  onChange={(e) => setFormData({ ...formData, color: capitalizeWords(e.target.value) })}
                  placeholder="e.g., Sao Paulo Yellow"
                />
              </div>
              <div>
                <Label htmlFor="interior">Interior</Label>
                <Input
                  id="interior"
                  value={formData.interior}
                  onChange={(e) => setFormData({ ...formData, interior: capitalizeWords(e.target.value) })}
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
            
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Images</Label>
              <div className="flex gap-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="cursor-pointer"
                />
                {uploadingImage && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>
            </div>

            {/* URL Input (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="image-url">Or Add Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="image-url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                />
                <Button type="button" onClick={addImage} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {images.length} image(s) • Drag to reorder • First image will be the main display
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group border-2 rounded-lg overflow-hidden cursor-move transition-all ${
                        draggedIndex === index 
                          ? 'border-primary scale-105 shadow-lg opacity-50' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Car ${index + 1}`} 
                        className="w-full h-32 object-cover pointer-events-none" 
                      />
                      
                      {/* Image number badge */}
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                      
                      {/* Drag indicator */}
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ⋮⋮
                      </div>
                      
                      {/* Control buttons */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        {/* Move up */}
                        <button
                          type="button"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          className="p-2 bg-white/90 hover:bg-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move left"
                        >
                          <ChevronUp className="w-4 h-4 text-gray-900 rotate-[-90deg]" />
                        </button>
                        
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 bg-destructive hover:bg-destructive/90 rounded-full"
                          title="Delete"
                        >
                          <X className="w-4 h-4 text-destructive-foreground" />
                        </button>
                        
                        {/* Move down */}
                        <button
                          type="button"
                          onClick={() => moveImageDown(index)}
                          disabled={index === images.length - 1}
                          className="p-2 bg-white/90 hover:bg-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move right"
                        >
                          <ChevronDown className="w-4 h-4 text-gray-900 rotate-[-90deg]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {car ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to cancel? All your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default CarManagementDialog;
