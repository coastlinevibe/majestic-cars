import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, vehicleInterest, budgetRange, financingNeeded, tradeIn, message } = req.body;

    // Validate required fields
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

    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
