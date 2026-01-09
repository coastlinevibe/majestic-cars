# Global Widget Settings Setup

## Overview
The widget settings are now stored in **Supabase database** so changes apply to ALL visitors globally, not just your browser.

## Setup Instructions

### 1. Create the Database Table

Run the SQL file in your Supabase SQL Editor:

```bash
# File: create-site-settings-table.sql
```

This creates:
- `site_settings` table to store global settings
- RLS policies (public read, authenticated write)
- Default settings (chatbot widget, phone: 0608579146)

### 2. Verify Table Creation

In Supabase Dashboard:
1. Go to **Table Editor**
2. You should see `site_settings` table
3. It should have one row with id: `global_settings`

## How It Works

### For Admins:
1. Go to `/admin` → **Settings** tab
2. Choose widget type (Chatbot or WhatsApp)
3. If WhatsApp: Enter phone number
4. Click **Save Number**
5. ✅ Changes apply **GLOBALLY** to all visitors immediately

### For Visitors:
- The app checks Supabase every 5 seconds for settings changes
- When admin changes widget type, all visitors see the change within 5 seconds
- No page refresh needed

## Features

### Widget Types:

**1. AI Chatbot**
- Automated chat assistant
- Answers common questions
- Built-in responses

**2. WhatsApp**
- Direct WhatsApp chat
- Opens WhatsApp with pre-filled message
- Uses admin-configured phone number

### Settings Sync:
- ✅ **Global**: All devices worldwide see the same widget
- ✅ **Real-time**: Changes apply within 5 seconds
- ✅ **Persistent**: Settings stored in database
- ✅ **Secure**: Only authenticated admins can change settings

## Testing

1. **Change widget type in admin panel**
2. **Open site in incognito/different browser**
3. **Wait 5 seconds**
4. **Verify the widget changed**

## Troubleshooting

### Widget not changing?
- Check if `site_settings` table exists
- Verify RLS policies are enabled
- Check browser console for errors
- Wait 5 seconds for polling to update

### Can't save settings?
- Make sure you're logged in as admin
- Check RLS policies allow authenticated users to update
- Verify Supabase credentials in `.env`

## Database Schema

```sql
site_settings
├── id (TEXT, PRIMARY KEY)
├── widget_type (TEXT, 'chatbot' | 'whatsapp')
├── whatsapp_number (TEXT)
└── updated_at (TIMESTAMPTZ)
```

## Security

- **Read**: Anyone can read settings (public)
- **Write**: Only authenticated users can update
- **RLS**: Row Level Security enabled
- **Validation**: Widget type constrained to valid values
