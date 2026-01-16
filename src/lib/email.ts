interface GeneralInquiryData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface VehicleInquiryData {
  name: string;
  email: string;
  phone: string;
  vehicleInterest: string;
  budgetRange: string;
  financingNeeded: string;
  tradeIn: string;
  message: string;
}

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001' 
  : '';

export const sendGeneralInquiryEmail = async (data: GeneralInquiryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/send-general-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending general inquiry email:', error);
    throw error;
  }
};

export const sendVehicleInquiryEmail = async (data: VehicleInquiryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/send-vehicle-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending vehicle inquiry email:', error);
    throw error;
  }
};
