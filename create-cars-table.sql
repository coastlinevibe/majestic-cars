-- DROP AND RECREATE CARS TABLE WITH CORRECT STRUCTURE
-- Run this in Supabase SQL Editor

-- Drop the existing table (WARNING: This will delete all existing data!)
DROP TABLE IF EXISTS cars CASCADE;

-- Create the cars table with correct structure
CREATE TABLE cars (
  -- Primary key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price BIGINT NOT NULL,
  body_type TEXT,
  mileage INTEGER DEFAULT 0,
  fuel_type TEXT DEFAULT 'Petrol',
  transmission TEXT DEFAULT 'Automatic',
  seats INTEGER DEFAULT 5,
  location TEXT,
  status TEXT DEFAULT 'available',
  vin TEXT,
  
  -- Performance Specifications
  drive_type TEXT,
  engine TEXT,
  power TEXT,
  torque TEXT,
  acceleration TEXT,
  top_speed TEXT,
  
  -- Appearance
  color TEXT,
  interior TEXT,
  
  -- Description
  description TEXT,
  
  -- JSON Fields
  features JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Tracking
  created_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_cars_make ON cars(make);
CREATE INDEX idx_cars_model ON cars(model);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_created_at ON cars(created_at);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- 1. Allow everyone to read cars (for public website)
CREATE POLICY "Public read access"
ON cars FOR SELECT
TO public
USING (true);

-- 2. Allow authenticated users to do everything
CREATE POLICY "Authenticated full access"
ON cars FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cars_updated_at
BEFORE UPDATE ON cars
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'cars'
ORDER BY ordinal_position;
