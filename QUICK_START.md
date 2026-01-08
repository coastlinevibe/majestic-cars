# Quick Start Guide - Admin Authentication

## What's Been Added

✅ **Sign-in authentication** - Admin login only (no sign-up)
✅ **Protected admin route** - requires login to access
✅ **Session persistence** - stays logged in across browser sessions
✅ **Security features** - 3 failed attempt limit, auto-close tab
✅ **Sign out functionality** - with user email display

## Setup Steps

### 1. Create Admin User in Supabase

**Go to Supabase Dashboard:**
1. Navigate to **Authentication** > **Users**
2. Click **Add User**
3. Enter:
   - Email: `majesticcars@gmail.com`
   - Password: `admin@majestic`
   - ✅ Check "Auto Confirm User"
4. Click **Create User**

### 2. Set Up RLS Policies

**Go to SQL Editor and run:**

```sql
-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read access" ON cars
  FOR SELECT USING (true);

-- Allow authenticated insert
CREATE POLICY "Allow authenticated insert" ON cars
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated update
CREATE POLICY "Allow authenticated update" ON cars
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated delete
CREATE POLICY "Allow authenticated delete" ON cars
  FOR DELETE TO authenticated USING (true);

-- Make created_by nullable
ALTER TABLE cars ALTER COLUMN created_by DROP NOT NULL;
```

### 3. Test It Out

1. **Start dev server**: `npm run dev`
2. **Go to**: `http://localhost:8080/admin`
3. **You'll be redirected to**: `/sign-in`
4. **Enter credentials**:
   - Email: `majesticcars@gmail.com`
   - Password: `admin@majestic`
5. **Click**: "Sign In"
6. **You're in!** 🎉

## How It Works

### Authentication Flow

```
User visits /admin
    ↓
Not logged in?
    ↓
Redirect to /sign-in
    ↓
User signs in
    ↓
Session stored in localStorage
    ↓
Redirect to /admin
    ↓
Access granted!
```

### Security Features

- **Session Persistence**: Uses localStorage to keep you logged in
- **Auto Refresh**: Tokens refresh automatically
- **Failed Attempts**: Max 3 attempts, then tab closes
- **Protected Routes**: Admin page requires authentication
- **Sign Out**: Clear session and redirect to sign-in

## Files Created

- `src/lib/auth.ts` - Authentication service
- `src/pages/SignIn.tsx` - Sign in page (no sign-up)
- `src/components/ProtectedRoute.tsx` - Route protection wrapper
- `AUTHENTICATION_SETUP.md` - Detailed setup guide
- `supabase-rls-policies.sql` - SQL policies for database

## Files Modified

- `src/App.tsx` - Added sign-in route and protected admin route
- `src/pages/Admin.tsx` - Added sign out button and user email display
- `src/lib/supabase.ts` - Added session persistence config

## Usage

### Sign In
- Go to `/sign-in` (or try to access `/admin`)
- Enter email: `majesticcars@gmail.com`
- Enter password: `admin@majestic`
- Click "Sign In"

### Sign Out
- Click "Sign Out" button in admin dashboard header
- You'll be redirected to sign-in page

### Add More Admin Users
- Go to Supabase Dashboard > Authentication > Users
- Click "Add User"
- Enter email and password
- Check "Auto Confirm User"
- Click "Create User"

## Troubleshooting

**Can't sign in?**
- Check email/password are correct
- Verify user exists in Supabase
- Make sure "Auto Confirm User" was checked

**Permission denied errors?**
- Run the RLS policies SQL commands
- Check you're signed in (email shows in admin header)

**Session not persisting?**
- Clear browser cache
- Check `.env` has correct Supabase credentials

## Next Steps

- ✅ Authentication working
- ✅ Admin route protected
- ✅ Session persistence enabled
- ✅ Sign out functionality added

**Now you can:**
1. Sign in to admin panel
2. Add/edit/delete cars
3. Stay logged in across sessions
4. Sign out when done

For detailed documentation, see `AUTHENTICATION_SETUP.md`
