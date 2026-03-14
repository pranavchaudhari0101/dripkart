import type { Env } from '../types/env'

export async function createRazorpayOrder(amount: number, receiptId: string, env: Env) {
  const credentials = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: Math.round(amount * 100), currency: 'INR', receipt: receiptId })
  })
  return await res.json()
}

export async function verifyRazorpaySignature(
  orderId: string, paymentId: string, signature: string, env: Env
): Promise<boolean> {
  const message = `${orderId}|${paymentId}`
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(env.RAZORPAY_KEY_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  const expected = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2,'0')).join('')
  return expected === signature
}
