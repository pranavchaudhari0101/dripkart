import type { Env } from '../types/env'

async function getToken(env: Env): Promise<string> {
  const cached = await env.CACHE.get('shiprocket:token')
  if (cached) return cached

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: env.SHIPROCKET_EMAIL, password: env.SHIPROCKET_PASSWORD })
  })
  const data = await res.json() as any
  const token = data.token

  // Cache for 23 hours (expires every 24h)
  await env.CACHE.put('shiprocket:token', token, { expirationTtl: 82800 })
  return token
}

export async function checkServiceability(from: string, to: string, weight: number, env: Env) {
  const token = await getToken(env)
  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${from}&delivery_postcode=${to}&weight=${weight}&cod=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.json()
}

export async function createOrder(orderData: any, env: Env) {
  const token = await getToken(env)
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      order_id: orderData.id,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: 'DRIPkaRt Warehouse',
      billing_customer_name: orderData.customer.name,
      billing_phone: orderData.customer.phone,
      billing_email: orderData.customer.email,
      billing_address: orderData.address.line1,
      billing_city: orderData.address.city,
      billing_state: orderData.address.state,
      billing_pincode: orderData.address.pincode,
      billing_country: 'India',
      shipping_is_billing: true,
      order_items: orderData.items.map((item: any) => ({
        name: item.productName,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: orderData.isCOD ? 'COD' : 'Prepaid',
      sub_total: orderData.finalAmount,
      length: 30, breadth: 25, height: 10,   // package dimensions cm
      weight: 0.5                             // kg per item approx
    })
  })
  return res.json()
}

export async function assignCourier(shipmentId: string, env: Env) {
  const token = await getToken(env)
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/courier/assign/awb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ shipment_id: shipmentId })
  })
  return res.json()
}

export async function generateLabel(shipmentId: string, env: Env) {
  const token = await getToken(env)
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/courier/generate/label', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ shipment_id: [shipmentId] })
  })
  const data = await res.json() as any
  return data.label_url   // PDF URL to print and stick on package
}

export async function trackOrder(awbCode: string, env: Env) {
  const token = await getToken(env)
  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.json()
}
