# Troubleshooting Guide - 403 Permission Denied

## Issue: "Failed to load" or "403 Forbidden" errors

This happens when Row Level Security (RLS) policies aren't set up correctly.

## Quick Fix

### Step 1: Run the Simple Setup SQL

Go to your Supabase Dashboard → SQL Editor and run this:

```sql
-- Simple RLS Setup for Cars Table

-- Disable RLS temporarily
ALTER TABLE cars DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access" ON cars;
DROP POLICY IF EXISTS "Allow public insert" ON cars;
DROP POLICY IF EXISTS "Allow public update" ON cars;
DROP POLICY IF EXISTS "Allow public delete" ON cars;
DROP POLICY IF EXISTS "Allow authenticated insert" ON cars;
DROP POLICY IF EXISTS "Allow authenticated update" ON cars;
DROP POLICY IF EXISTS "Allow authenticated delete" ON cars;

-- Make created_by nullable
ALTER TABLE cars ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE cars ALTER COLUMN created_by SET DEFAULT 'system';

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read (for public website)
CREATE POLICY "Public read access"
ON cars FOR SELECT
TO public
USING (true);

-- Allow authenticated users full access
CREATE POLICY "Authenticated full access"
ON cars FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

### Step 2: Verify Your .env File

Make sure your `.env` file exists and has the correct values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**How to get these:**
1. Go to Supabase Dashboard
2. Click on your project
3. Go to Settings → API
4. Copy "Project URL" → paste as VITE_SUPABASE_URL
5. Copy "anon public" key → paste as VITE_SUPABASE_ANON_KEY

### Step 3: Restart Dev Server

After updating `.env`:

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

### Step 4: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Step 5: Test Authentication

1. Go to `http://localhost:8080/sign-in`
2. Sign in with: `majesticcars@gmail.com` / `admin@majestic`
3. Check browser console for any errors
4. You should see your email in the admin header

## Common Issues

### "Invalid API key"
- Check your `.env` file has the correct anon key
- Make sure the key starts with `eyJ...`
- Restart dev server after changing `.env`

### "User not found" or "Invalid credentials"
- Go to Supabase → Authentication → Users
- Make sure the user exists
- Check "Auto Confirm User" was enabled
- Try creating the user again

### "Permission denied for table cars"
- Run the SQL setup above
- Make sure RLS is enabled
- Verify policies are created (check in Supabase → Authentication → Policies)

### Still getting 403 errors after signing in
- Check browser console for detailed error
- Verify you're actually signed in (email shows in header)
- Try signing out and signing in again
- Clear localStorage: `localStorage.clear()` in console

## Verify Setup

### Check if policies exist:

Run this in SQL Editor:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'cars';
```

You should see:
- "Public read access" - for SELECT
- "Authenticated full access" - for ALL

### Check if user is authenticated:

In browser console:

```javascript
// Check session
const { data } = await supabase.auth.getSession();
console.log('Session:', data.session);

// Should show user email and access token
```

### Test database access:

In browser console:

```javascript
// Test read
const { data, error } = await supabase.from('cars').select('*');
console.log('Cars:', data, 'Error:', error);

// Should return empty array or cars, not an error
```

## Still Not Working?

### Option 1: Temporarily Disable RLS (Development Only!)

**⚠️ WARNING: Only for local development, NEVER in production!**

```sql
ALTER TABLE cars DISABLE ROW LEVEL SECURITY;
```

This will allow all operations without authentication. Use only for testing.

### Option 2: Check Supabase Service Status

- Go to https://status.supabase.com/
- Check if there are any ongoing issues

### Option 3: Check Network Tab

1. Open DevTools → Network tab
2. Try to load cars
3. Look for failed requests
4. Check the response for detailed error messages

## Need More Help?

1. Check browser console for errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify all environment variables
4. Make sure you're on the latest code
5. Try creating a new Supabase project

## Success Checklist

- ✅ `.env` file exists with correct values
- ✅ Dev server restarted after `.env` changes
- ✅ User created in Supabase with "Auto Confirm User"
- ✅ RLS policies created (run SQL above)
- ✅ Can sign in successfully
- ✅ Email shows in admin header
- ✅ No 403 errors in console
- ✅ Can add/edit/delete cars

If all checkboxes are checked, everything should work! 🎉
