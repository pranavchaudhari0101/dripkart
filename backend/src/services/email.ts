import { Resend } from 'resend'
import type { Env } from '../types/env'

function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatShippingAddress(address: any): string {
  if (!address) return 'N/A';
  const parts = [];
  if (address.line1) parts.push(escapeHtml(address.line1) + '<br>');
  
  let cityState = '';
  if (address.city) cityState += escapeHtml(address.city);
  if (address.state) cityState += (cityState ? ', ' : '') + escapeHtml(address.state);
  if (address.pincode) cityState += (cityState ? ' ' : '') + escapeHtml(address.pincode);
  
  if (cityState) parts.push(cityState + '<br>');
  if (address.phone) parts.push('Phone: ' + escapeHtml(address.phone));
  
  return parts.length > 0 ? parts.join('\n') : 'N/A';
}

function isValidHttpUrl(str: string | null | undefined): boolean {
  if (!str) return false;
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

export async function sendOrderConfirmedEmail(
  email: string,
  orderDetails: any,
  env: Env
) {
  if (!env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping Order Confirmed email.')
    return
  }

  const resend = new Resend(env.RESEND_API_KEY)

  try {
    const data = await resend.emails.send({
      from: 'Dripkart Orders <onboarding@resend.dev>',
      to: [email],
      subject: `Order Confirmed: ${orderDetails.id}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <h1 style="color: #c8ff00; background: #111827; padding: 20px; text-align: center; text-transform: uppercase; margin-bottom: 0;">Dripkart</h1>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="font-size: 24px; font-weight: 800; text-transform: uppercase;">Order Confirmed</h2>
            <p>Hi ${escapeHtml(orderDetails.shippingAddress?.fullName || 'Customer')},</p>
            <p>Thank you for your order! We're getting it ready to be shipped. We will notify you once it's on the way.</p>
            
            <div style="background: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-weight: bold;">Order ID: ${escapeHtml(orderDetails.id)}</p>
              <p style="margin: 5px 0 0 0; font-weight: bold;">Total Amount: ₹${orderDetails.finalAmount != null ? orderDetails.finalAmount.toLocaleString() : 'N/A'}</p>
            </div>
            
            <h3 style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Shipping Address</h3>
            <p style="margin: 5px 0;">
              ${formatShippingAddress(orderDetails.shippingAddress)}
            </p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">If you have any questions, simply reply to this email.</p>
          </div>
        </div>
      `,
    })
    console.log('Order Confirmed email sent:', data)
    return data
  } catch (error) {
    console.error('Error sending Order Confirmed email:', error)
    throw error
  }
}

export async function sendOrderShippedEmail(
  email: string,
  orderDetails: any,
  trackingUrl: string | null,
  env: Env
) {
  if (!env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping Order Shipped email.')
    return
  }

  const resend = new Resend(env.RESEND_API_KEY)

  try {
    const data = await resend.emails.send({
      from: 'Dripkart Orders <onboarding@resend.dev>',
      to: [email],
      subject: `Your Order is on the way! (${orderDetails.id})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <h1 style="color: #c8ff00; background: #111827; padding: 20px; text-align: center; text-transform: uppercase; margin-bottom: 0;">Dripkart</h1>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="font-size: 24px; font-weight: 800; text-transform: uppercase;">Order Shipped</h2>
            <p>Great news! Your order has been shipped and is on its way to you.</p>
            
            <div style="background: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-weight: bold;">Order ID: ${escapeHtml(orderDetails.id)}</p>
              <p style="margin: 5px 0 0 0;"><strong>Courier:</strong> ${escapeHtml(orderDetails.courierName || 'Standard Shipping')}</p>
              <p style="margin: 5px 0 0 0;"><strong>AWB / Tracking:</strong> ${escapeHtml(orderDetails.awbCode || 'Pending')}</p>
            </div>
            
            ${isValidHttpUrl(trackingUrl) ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${escapeHtml(trackingUrl)}" style="background: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 2px;">Track Your Package</a>
              </div>
            ` : '<p>Tracking information will be available shortly.</p>'}
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">If you have any questions, simply reply to this email.</p>
          </div>
        </div>
      `,
    })
    console.log('Order Shipped email sent:', data)
    return data
  } catch (error) {
    console.error('Error sending Order Shipped email:', error)
    throw error
  }
}
