# Email Setup with Resend

## ✅ API Key Already Configured

Your Resend API key is already in the `.env` file:
```env
RESEND_API_KEY=re_P5eQL1fa_AQEvqFrvJS4Jrg5KdCRR9Lxi
```

## 🚀 How to Run

### Development (Local Testing)

You need to run BOTH the frontend and API server:

```bash
# Option 1: Run both at once (recommended)
npm run dev:all

# Option 2: Run separately in two terminals
# Terminal 1:
npm run dev

# Terminal 2:
npm run dev:api
```

The setup:
- **Frontend**: http://localhost:8080 (Vite)
- **API Server**: http://localhost:3001 (Express)

### Production (Vercel)

When deployed to Vercel, the API routes in the `/api` folder will work automatically. No need to run the separate API server.

## 📧 Email Configuration

- **From Address**: `noreply@majesticars.com`
- **To Address**: `majesticcarssinoville@gmail.com`
- **Domain**: `majesticars.com` (Ireland/eu-west-1)

Make sure your domain `majesticars.com` is verified in Resend.

## ✨ Features Implemented

### 1. Email Integration
- Both contact forms send emails to `majesticcarssinoville@gmail.com`
- General inquiry form sends subject-based emails
- Vehicle inquiry form sends detailed car interest emails

### 2. Demo Autofill Buttons
- Each form has a "Demo" button (sparkle icon) in the top-right corner
- Click to instantly fill the form with sample data for testing
- Great for development and testing the email functionality

### 3. Loading States
- Submit buttons show "Sending..." while processing
- Buttons are disabled during submission to prevent double-clicks

### 4. Error Handling
- Toast notifications for success and error states
- Graceful error messages if email sending fails

## 🧪 Testing

1. Run both servers: `npm run dev:all`
2. Go to http://localhost:8080/contact
3. Click the "Demo" button to autofill
4. Submit the form
5. Check `majesticcarssinoville@gmail.com` for the email

## 📁 Files Created/Modified

- `server.ts` - Local development API server
- `api/send-general-inquiry.ts` - Vercel serverless function for general inquiries
- `api/send-vehicle-inquiry.ts` - Vercel serverless function for vehicle inquiries
- `src/lib/email.ts` - Frontend email service (calls API endpoints)
- `src/pages/Contact.tsx` - Updated with email sending and demo buttons
- `.env` - Contains `RESEND_API_KEY`
- `package.json` - Added dev scripts and dependencies

## 🔧 How It Works

### Development
- Frontend makes requests to `http://localhost:3001/api/*`
- Express server (`server.ts`) handles the requests
- Server uses Resend SDK to send emails

### Production
- Frontend makes requests to `/api/*` (same domain)
- Vercel serverless functions handle the requests
- Functions use Resend SDK to send emails

The `src/lib/email.ts` automatically detects the environment and uses the correct API URL.
