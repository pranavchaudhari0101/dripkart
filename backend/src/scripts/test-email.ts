import { sendOrderConfirmedEmail } from '../services/email';

const dummyOrder = {
  id: 'test_ord_12345',
  finalAmount: 1499,
  shippingAddress: {
    fullName: 'Test User',
    line1: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '9876543210',
    email: 'delivered@resend.dev'
  }
};

async function test() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not defined in process.env');
    process.exit(1);
  }

  const env = { RESEND_API_KEY: apiKey } as any;
  console.log('Sending test email...');
  try {
    const result = await sendOrderConfirmedEmail('delivered@resend.dev', dummyOrder, env);
    console.log('Success:', result);
  } catch (err) {
    console.error('Failed:', err);
  }
}

test();