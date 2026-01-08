-- Fix the created_by column to not require user lookup
-- Run this in Supabase SQL Editor

-- Option 1: Make created_by just store the user ID as text (no foreign key)
-- This is simpler and avoids permission issues

-- First, drop the foreign key constraint
ALTER TABLE cars DROP CONSTRAINT IF EXISTS cars_created_by_fkey;

-- Make sure the column is nullable and has a default
ALTER TABLE cars ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE cars ALTER COLUMN created_by SET DEFAULT 'system';

-- Update any NULL values to 'system'
UPDATE cars SET created_by = 'system' WHERE created_by IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'cars' AND column_name = 'created_by';
