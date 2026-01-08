-- Simple RLS Setup for Cars Table
-- Run this in your Supabase SQL Editor

-- First, disable RLS temporarily to clean up
ALTER TABLE cars DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access" ON cars;
DROP POLICY IF EXISTS "Allow public insert" ON cars;
DROP POLICY IF EXISTS "Allow public update" ON cars;
DROP POLICY IF EXISTS "Allow public delete" ON cars;
DROP POLICY IF EXISTS "Allow authenticated insert" ON cars;
DROP POLICY IF EXISTS "Allow authenticated update" ON cars;
DROP POLICY IF EXISTS "Allow authenticated delete" ON cars;
DROP POLICY IF EXISTS "Public read access" ON cars;
DROP POLICY IF EXISTS "Authenticated full access" ON cars;

-- IMPORTANT: Remove the foreign key constraint to users table
-- This prevents "permission denied for table users" errors
ALTER TABLE cars DROP CONSTRAINT IF EXISTS cars_created_by_fkey;

-- Make created_by nullable and set default
ALTER TABLE cars ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE cars ALTER COLUMN created_by SET DEFAULT 'system';

-- Update any NULL values
UPDATE cars SET created_by = 'system' WHERE created_by IS NULL;

-- Now enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create simple policies that allow everything for authenticated users
-- and read-only for public

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

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'cars';
