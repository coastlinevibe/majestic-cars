import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// General inquiry endpoint
app.post('/api/send-general-inquiry', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await resend.emails.send({
      from: 'Majestic Cars <noreply@majesticars.com>',
      to: 'majesticcarssinoville@gmail.com',
      subject: `General Inquiry: ${subject}`,
      html: `
        <h2>New General Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Vehicle inquiry endpoint
app.post('/api/send-vehicle-inquiry', async (req, res) => {
  try {
    const { name, email, phone, vehicleInterest, budgetRange, financingNeeded, tradeIn, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await resend.emails.send({
      from: 'Majestic Cars <noreply@majesticars.com>',
      to: 'majesticcarssinoville@gmail.com',
      subject: `Vehicle Inquiry: ${vehicleInterest || 'General Interest'}`,
      html: `
        <h2>New Vehicle Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Vehicle of Interest:</strong> ${vehicleInterest || 'Not specified'}</p>
        <p><strong>Budget Range:</strong> ${budgetRange || 'Not specified'}</p>
        <p><strong>Financing Needed:</strong> ${financingNeeded || 'Not specified'}</p>
        <p><strong>Trade-In:</strong> ${tradeIn || 'None'}</p>
        <p><strong>Additional Information:</strong></p>
        <p>${message ? message.replace(/\n/g, '<br>') : 'None provided'}</p>
      `,
    });

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
