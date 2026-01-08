# Recreate Cars Table - Instructions

## ⚠️ WARNING
This will **DELETE ALL EXISTING DATA** in your cars table and create a fresh one with the correct structure.

## Step 1: Backup Your Data (Optional)

If you have existing data you want to keep, run this first:

```sql
-- Export existing data
SELECT * FROM cars;
```

Copy the results somewhere safe.

## Step 2: Run the SQL

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `create-cars-table.sql`
4. Click **Run** (or Ctrl+Enter)

## Step 3: Verify Table Structure

Run this to check the table was created correctly:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'cars'
ORDER BY ordinal_position;
```

You should see these columns:
- `id` (uuid)
- `make` (text)
- `model` (text)
- `year` (integer)
- `price` (bigint)
- `body_type` (text)
- `mileage` (integer)
- `fuel_type` (text)
- `transmission` (text)
- `seats` (integer)
- `location` (text)
- `status` (text)
- `vin` (text)
- `drive_type` (text)
- `engine` (text)
- `power` (text)
- `torque` (text)
- `acceleration` (text)
- `top_speed` (text)
- `color` (text)
- `interior` (text)
- `description` (text)
- `features` (jsonb)
- `specs` (jsonb)
- `images` (jsonb)
- `created_by` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Step 4: Verify RLS Policies

```sql
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'cars';
```

You should see:
- `Public read access` - SELECT - {public}
- `Authenticated full access` - ALL - {authenticated}

## Step 5: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Step 6: Test It

1. Go to `http://localhost:8080/sign-in`
2. Sign in with: `majesticcars@gmail.com` / `admin@majestic`
3. Go to admin dashboard
4. Click "Add Vehicle"
5. Click "Auto-Fill"
6. Click "Add Vehicle"
7. Success! ✅

## What Changed

### Removed:
- ❌ `name` column (was causing confusion)
- ❌ Foreign key to `auth.users` (was causing permission errors)

### Kept:
- ✅ `make` and `model` as separate fields
- ✅ All performance specs
- ✅ JSONB fields for features, specs, images
- ✅ `created_by` as TEXT (no foreign key)

### Added:
- ✅ Indexes for better performance
- ✅ Auto-update trigger for `updated_at`
- ✅ Proper RLS policies
- ✅ Default values for common fields

## Table Structure

```
cars
├── id (UUID, Primary Key)
├── make (TEXT, Required)
├── model (TEXT, Required)
├── year (INTEGER, Required)
├── price (BIGINT, Required)
├── body_type (TEXT)
├── mileage (INTEGER, Default: 0)
├── fuel_type (TEXT, Default: 'Petrol')
├── transmission (TEXT, Default: 'Automatic')
├── seats (INTEGER, Default: 5)
├── location (TEXT)
├── status (TEXT, Default: 'available')
├── vin (TEXT)
├── drive_type (TEXT)
├── engine (TEXT)
├── power (TEXT)
├── torque (TEXT)
├── acceleration (TEXT)
├── top_speed (TEXT)
├── color (TEXT)
├── interior (TEXT)
├── description (TEXT)
├── features (JSONB, Default: [])
├── specs (JSONB, Default: {})
├── images (JSONB, Default: [])
├── created_by (TEXT, Default: 'system')
├── created_at (TIMESTAMPTZ, Default: NOW())
└── updated_at (TIMESTAMPTZ, Default: NOW())
```

## Code Updated

The following files have been updated to match the new table structure:
- ✅ `src/lib/supabase.ts` - Car interface and CRUD operations
- ✅ No more `name` field handling
- ✅ Simplified insert/update logic

## Success Checklist

- ✅ SQL ran without errors
- ✅ Table structure verified
- ✅ RLS policies created
- ✅ Dev server restarted
- ✅ Can sign in
- ✅ Can add vehicles
- ✅ No errors in console

---

**Everything should work perfectly now!** 🎉

The table structure matches exactly what the code expects.
