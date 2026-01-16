# Testing Email Functionality

## Quick Start

Your Resend API key is already in `.env`: `RESEND_API_KEY=re_P5eQL1fa_AQEvqFrvJS4Jrg5KdCRR9Lxi`

## Local Testing with Vercel CLI

Since the email functionality uses Vercel serverless functions, you need to test with Vercel CLI:

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Run Local Development Server
```bash
vercel dev
```

This will:
- Start your app (usually at `http://localhost:3000`)
- Run the Vercel functions locally
- Load environment variables from `.env`

### 3. Test the Forms
1. Open `http://localhost:3000` in your browser
2. Navigate to the Contact page
3. Click the "Demo" button on either form to autofill
4. Submit the form
5. Check `majesticcarssinoville@gmail.com` for the email

## Production Testing

### 1. Deploy to Vercel
```bash
vercel --prod
```

### 2. Add Environment Variable in Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add: `RESEND_API_KEY` = `re_P5eQL1fa_AQEvqFrvJS4Jrg5KdCRR9Lxi`
5. Redeploy if needed

### 3. Test on Production
Visit your deployed site and test the contact forms.

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure you're using `vercel dev` instead of `npm run dev` for local testing.

### 404 on API Routes
Make sure the `api/` folder is in the root of your project (not inside `src/`).

### Email Not Sending
1. Check that `RESEND_API_KEY` is set correctly
2. Verify your domain `majesticars.com` is verified in Resend dashboard
3. Check Vercel function logs for errors

## Email Recipients

Both forms send to: **majesticcarssinoville@gmail.com**
