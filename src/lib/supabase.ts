import { createClient } from '@supabase/supabase-js';

// These will be set from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

// Database types based on your table structure
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  body_type: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  drive_type: string;
  engine: string;
  color: string;
  interior: string;
  vin: string;
  seats: number;
  location: string;
  description: string;
  features: string[];
  specs: Record<string, any>;
  images: string[];
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Car operations
export const carService = {
  // Get all cars
  async getAllCars() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  },

  // Get single car by ID
  async getCarById(id: string) {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new car
  async createCar(car: Omit<Car, 'id' | 'created_at' | 'updated_at'>) {
    try {
      // Get current session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to add cars');
      }

      // Don't include created_by in the insert - let the database handle it
      const { created_by, ...carDataWithoutCreatedBy } = car as any;
      
      const { data, error } = await supabase
        .from('cars')
        .insert([carDataWithoutCreatedBy])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  },

  // Update car
  async updateCar(id: string, updates: Partial<Car>) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to update cars');
      }

      const { data, error } = await supabase
        .from('cars')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  },

  // Delete car
  async deleteCar(id: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to delete cars');
      }

      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  },

  // Search cars
  async searchCars(query: string) {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .or(`make.ilike.%${query}%,model.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Filter cars by status
  async filterByStatus(status: string) {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Upload image to storage
  async uploadImage(filePath: string, file: File) {
    const { data, error } = await supabase.storage
      .from('car_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    return data;
  },

  // Get public URL for image
  getImageUrl(filePath: string) {
    return supabase.storage
      .from('car_images')
      .getPublicUrl(filePath);
  },

  // Delete image from storage
  async deleteImage(filePath: string) {
    const { error } = await supabase.storage
      .from('car_images')
      .remove([filePath]);
    
    if (error) throw error;
  },

  // Delete entire folder (for when car is deleted)
  async deleteFolder(folderPath: string) {
    try {
      console.log('Attempting to list files in folder:', folderPath);
      
      // List all files in the folder
      const { data: files, error: listError } = await supabase.storage
        .from('car_images')
        .list(folderPath);
      
      if (listError) {
        console.error('Error listing files:', listError);
        throw listError;
      }
      
      console.log('Files found in folder:', files);
      
      if (files && files.length > 0) {
        // Create array of file paths to delete
        const filePaths = files.map(file => `${folderPath}/${file.name}`);
        console.log('Deleting files:', filePaths);
        
        // Delete all files in the folder
        const { error: deleteError } = await supabase.storage
          .from('car_images')
          .remove(filePaths);
        
        if (deleteError) {
          console.error('Error deleting files:', deleteError);
          throw deleteError;
        }
        
        console.log('Successfully deleted', filePaths.length, 'files');
      } else {
        console.log('No files found in folder:', folderPath);
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  }
};
