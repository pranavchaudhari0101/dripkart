import dotenv from 'dotenv';
dotenv.config({ path: '.dev.vars' });

async function testShiprocket() {
  const env = process.env;
  
  if (!env.SHIPROCKET_EMAIL || !env.SHIPROCKET_PASSWORD) {
    throw new Error('Shiprocket credentials missing in .dev.vars');
  }

  console.log('1. Authenticating with Shiprocket...');
  const loginRes = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: env.SHIPROCKET_EMAIL, password: env.SHIPROCKET_PASSWORD })
  });
  
  const loginData = await loginRes.json() as any;
  if (!loginRes.ok || !loginData.token) {
    console.error('Shiprocket Auth Failed:', loginData);
    return;
  }
  
  const token = loginData.token;
  console.log('Authentication Successful! Token received.');

  console.log('2. Creating Dummy Shipment (Adhoc Order)...');
  const dummyOrder = {
    order_id: `test_ord_${Date.now()}`,
    order_date: new Date().toISOString().split('T')[0],
    pickup_location: 'Primary', // Must match the user's pickup location name in Shiprocket dashboard
    billing_customer_name: 'Test Customer',
    billing_last_name: 'User',
    billing_address: '123 Test Street',
    billing_city: 'Mumbai',
    billing_pincode: '400001',
    billing_state: 'Maharashtra',
    billing_country: 'India',
    billing_email: 'test@example.com',
    billing_phone: '9876543210',
    shipping_is_billing: true,
    order_items: [
      {
        name: 'Test Product',
        sku: 'TEST-SKU-1',
        units: 1,
        selling_price: 999,
      }
    ],
    payment_method: 'Prepaid',
    sub_total: 999,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5
  };

  const orderRes = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(dummyOrder)
  });

  const orderData = await orderRes.json() as any;
  console.log('Shiprocket Create Order Response:', orderData);
}

testShiprocket().catch(console.error);
