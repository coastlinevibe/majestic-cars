# 🚀 Quick Start - Email Forms

## ✅ Setup Complete!

The API server is already running on **http://localhost:3001**

## 📝 Next Steps

1. **Make sure your frontend is running:**
   ```bash
   npm run dev
   ```
   (Should be on http://localhost:8080)

2. **Test the contact forms:**
   - Go to http://localhost:8080/contact
   - Click the "Demo" button on either form to autofill with test data
   - Click "Send" to test the email

3. **Check your email:**
   - Emails will be sent to: `majesticcarssinoville@gmail.com`
   - Check your inbox for the test emails

## 🎯 What's Working

- ✅ API Server running on port 3001
- ✅ Resend API key configured
- ✅ Both contact forms ready to send emails
- ✅ Demo buttons for quick testing
- ✅ Vercel functions ready for production

## 🔄 If You Need to Restart

```bash
# Stop everything and run both together:
npm run dev:all
```

This will start both the frontend (port 8080) and API server (port 3001) at the same time.

## 📧 Email Details

**Emails are sent to:** majesticcarssinoville@gmail.com

**From domain:** majesticars.com (noreply@majesticars.com)

**Two types of emails:**
1. General Inquiry - For general questions and support
2. Vehicle Inquiry - For car purchase inquiries with detailed info

## 🐛 Troubleshooting

If emails aren't sending:
1. Check that API server is running (should see "API server running on http://localhost:3001")
2. Verify your Resend API key in `.env` file
3. Make sure your domain is verified in Resend dashboard
4. Check browser console for any errors
