-- Fix Storage RLS Policies for car_images bucket

-- First, drop existing policies if any
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create new policies for car_images bucket

-- 1. Allow PUBLIC read access (so images can be viewed by anyone)
CREATE POLICY "car_images_public_read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'car_images' );

-- 2. Allow AUTHENTICATED users to upload
CREATE POLICY "car_images_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'car_images' );

-- 3. Allow AUTHENTICATED users to update
CREATE POLICY "car_images_authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'car_images' );

-- 4. Allow AUTHENTICATED users to delete
CREATE POLICY "car_images_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'car_images' );

-- Verify the bucket exists and is public
-- Run this separately to check:
-- SELECT * FROM storage.buckets WHERE name = 'car_images';
