import dotenv from 'dotenv';
dotenv.config({ path: '.dev.vars' });

async function sha256Hex(data: string): Promise<string> {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data))
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2,'0')).join('')
}

async function test() {
  const env = process.env;
  const orderId = `ord_${crypto.randomUUID().replace(/-/g, '')}`;
  const amount = 1299;
  const mobile = '9876543210';
  
  const payload = {
    merchantId: env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: orderId,
    amount: Math.round(amount * 100), // paise
    redirectUrl: `${env.FRONTEND_URL}/order-success?orderId=${orderId}`,
    redirectMode: 'REDIRECT',
    callbackUrl: `${env.BACKEND_URL}/api/payments/phonepe/callback`,
    mobileNumber: mobile,
    paymentInstrument: { type: 'PAY_PAGE' }
  }

  const base64 = btoa(JSON.stringify(payload))
  const checksum = await sha256Hex(base64 + '/pg/v1/pay' + env.PHONEPE_SALT_KEY)
    + '###' + env.PHONEPE_SALT_INDEX

  const apiUrl = env.PHONEPE_ENV === 'production' 
    ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'

  console.log('API URL:', apiUrl);
  console.log('Payload:', payload);

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum },
    body: JSON.stringify({ request: base64 })
  })

  const data = await res.json() as any
  console.log('RESPONSE:', data);
}

test().catch(console.error);
