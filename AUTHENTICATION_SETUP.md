# Authentication Setup Guide

## Step 1: Create Admin User in Supabase

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add User** button
4. Fill in the details:
   - **Email**: `majesticcars@gmail.com`
   - **Password**: `admin@majestic`
   - **Auto Confirm User**: ✅ Check this box (important!)
5. Click **Create User**

### Option B: Using SQL Editor

1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL command:

```sql
-- Create the admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'majesticcars@gmail.com',
  crypt('admin@majestic', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## Step 2: Configure RLS Policies for Cars Table

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable RLS on the cars table
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read cars (for public viewing)
CREATE POLICY "Allow public read access" ON cars
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert cars
CREATE POLICY "Allow authenticated insert" ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update cars
CREATE POLICY "Allow authenticated update" ON cars
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete cars
CREATE POLICY "Allow authenticated delete" ON cars
  FOR DELETE
  TO authenticated
  USING (true);

-- Make created_by nullable (optional)
ALTER TABLE cars ALTER COLUMN created_by DROP NOT NULL;
```

## Step 3: Test the Authentication Flow

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Try accessing the admin page**:
   - Navigate to `http://localhost:8080/admin`
   - You should be redirected to `/sign-up`

3. **Sign in with the admin credentials**:
   - Email: `majesticcars@gmail.com`
   - Password: `admin@majestic`
   - Click "Sign In"

4. **Verify session persistence**:
   - After signing in, you should be redirected to `/admin`
   - Refresh the page - you should stay logged in
   - Close and reopen the browser - you should still be logged in

5. **Test sign out**:
   - Click the "Sign Out" button in the admin dashboard
   - You should be redirected to `/sign-up`
   - Try accessing `/admin` again - you should be redirected to `/sign-up`

## Features Implemented

### 🔐 Authentication
- ✅ Sign up new users
- ✅ Sign in existing users
- ✅ Session persistence in cookies/localStorage
- ✅ Auto-refresh tokens
- ✅ Protected admin route

### 🛡️ Security Features
- ✅ Failed login attempt tracking (max 3 attempts)
- ✅ Auto-close tab after 3 failed attempts
- ✅ Password minimum length (6 characters)
- ✅ Email validation
- ✅ Secure password hashing by Supabase

### 🎨 User Experience
- ✅ Loading states during authentication
- ✅ Error messages for failed attempts
- ✅ Success notifications
- ✅ Redirect to admin after successful login
- ✅ Redirect to sign-up if not authenticated
- ✅ Display current user email in admin dashboard
- ✅ Sign out functionality

## Troubleshooting

### "Invalid login credentials"
- Verify the email and password are correct
- Make sure you checked "Auto Confirm User" when creating the user
- Check that the user exists in Authentication > Users

### "Failed to load cars" or "Permission denied"
- Make sure RLS policies are set up correctly
- Verify you're signed in (check the email in the admin header)
- Check browser console for detailed error messages

### Session not persisting
- Clear browser cache and cookies
- Check that your `.env` file has the correct Supabase credentials
- Verify localStorage is enabled in your browser

### Redirected to sign-up when already logged in
- Check browser console for authentication errors
- Try signing out and signing in again
- Clear localStorage and try again

## Security Best Practices

### For Production:

1. **Use strong passwords**:
   - Change the default password to something more secure
   - Use a password manager

2. **Enable email confirmation**:
   - Configure email templates in Supabase
   - Require email verification for new users

3. **Add rate limiting**:
   - Configure Supabase rate limiting
   - Add CAPTCHA for login attempts

4. **Use environment variables**:
   - Never commit `.env` file to version control
   - Use different credentials for development and production

5. **Monitor authentication logs**:
   - Check Supabase logs regularly
   - Set up alerts for suspicious activity

## Next Steps

1. **Add more admin users**: Create additional users in Supabase
2. **Implement roles**: Add role-based access control (admin, editor, viewer)
3. **Add 2FA**: Enable two-factor authentication
4. **Email notifications**: Set up email templates for password reset, etc.
5. **Audit logs**: Track who makes changes to vehicles

## Support

For authentication issues:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Discord](https://discord.supabase.com)
