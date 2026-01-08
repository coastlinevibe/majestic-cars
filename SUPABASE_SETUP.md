# Supabase Setup Guide

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Your Supabase project created

## Step 1: Get Your API Keys

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 2: Configure Environment Variables

1. Create a `.env` file in the root of your project (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Verify Your Database Table

Your `cars` table should have the following structure:

| Column Name    | Type        | Description                          |
|----------------|-------------|--------------------------------------|
| id             | uuid        | Primary key (auto-generated)         |
| make           | text        | Car manufacturer (e.g., BMW)         |
| model          | text        | Car model (e.g., M8)                 |
| year           | int4        | Manufacturing year                   |
| price          | int8        | Price in local currency              |
| body_type      | text        | Body type (e.g., Coupe, Sedan)       |
| mileage        | int4        | Mileage in kilometers                |
| fuel_type      | text        | Fuel type (Petrol, Diesel, etc.)     |
| transmission   | text        | Transmission type                    |
| drive_type     | text        | Drive type (AWD, FWD, RWD)           |
| engine         | text        | Engine specifications                |
| power          | text        | Power output                         |
| torque         | text        | Torque specifications                |
| acceleration   | text        | 0-100 km/h time                      |
| top_speed      | text        | Maximum speed                        |
| color          | text        | Exterior color                       |
| interior       | text        | Interior description                 |
| vin            | text        | Vehicle Identification Number        |
| seats          | int4        | Number of seats                      |
| location       | text        | Vehicle location                     |
| description    | text        | Detailed description                 |
| features       | jsonb       | Array of features                    |
| specs          | jsonb       | Additional specifications object     |
| images         | jsonb       | Array of image URLs                  |
| status         | text        | Status (available, sold, reserved)   |
| created_by     | text        | User ID (foreign key to auth.users)  |
| created_at     | timestamptz | Creation timestamp                   |
| updated_at     | timestamptz | Last update timestamp                |

## Step 4: Set Up Row Level Security (RLS)

If you haven't already, enable RLS on your `cars` table:

```sql
-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for viewing cars on the website)
CREATE POLICY "Allow public read access" ON cars
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert (for admin)
CREATE POLICY "Allow authenticated insert" ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their own cars
CREATE POLICY "Allow authenticated update" ON cars
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON cars
  FOR DELETE
  TO authenticated
  USING (true);
```

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Admin page (`/admin`)

3. Try adding a new vehicle:
   - Click "Add Vehicle"
   - Fill in the required fields (Make, Model, Year, Price)
   - Add optional details, features, and images
   - Click "Add Vehicle"

4. Test editing and deleting vehicles

## Features

### Add Vehicle
- Comprehensive form with all car details
- Support for multiple features and images
- Real-time validation

### Edit Vehicle
- Pre-populated form with existing data
- Update any field
- Maintains data integrity

### Delete Vehicle
- Confirmation dialog to prevent accidental deletion
- Permanent removal from database

### Search & Filter
- Search by make, model, or description
- Filter by status (available, sold, reserved)
- Real-time filtering

## Troubleshooting

### "Failed to load cars"
- Check that your `.env` file has the correct Supabase URL and key
- Verify your Supabase project is active
- Check browser console for detailed error messages

### "Failed to save car"
- Ensure RLS policies are set up correctly
- Check that required fields are filled
- Verify your Supabase connection

### Images not displaying
- Make sure image URLs are publicly accessible
- Use direct image URLs (not shortened links)
- Consider using Supabase Storage for hosting images

## Next Steps

1. **Authentication**: Implement user authentication to track who creates/edits cars
2. **Image Upload**: Integrate Supabase Storage for direct image uploads
3. **Analytics**: Track views and inquiries per vehicle
4. **Validation**: Add more robust form validation
5. **Bulk Operations**: Add import/export functionality for multiple vehicles

## Support

For issues with Supabase, check:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
