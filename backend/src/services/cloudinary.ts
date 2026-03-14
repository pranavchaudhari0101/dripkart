import type { Env } from '../types/env'

async function sha1(data: string, secret: string): Promise<string> {
  const msg = new TextEncoder().encode(data + secret)
  const hash = await crypto.subtle.digest('SHA-1', msg)
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('')
}

export async function uploadImage(buffer: ArrayBuffer, filename: string, env: Env) {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const folder = 'dripkart/products'
  const params = `folder=${folder}&timestamp=${timestamp}`
  const signature = await sha1(params, env.CLOUDINARY_API_SECRET)

  const form = new FormData()
  form.append('file', new Blob([buffer]), filename)
  form.append('api_key', env.CLOUDINARY_API_KEY)
  form.append('timestamp', timestamp)
  form.append('folder', folder)
  form.append('signature', signature)
  form.append('transformation', 'w_1200,h_1600,c_fill,q_auto,f_auto') // Optimal size for store

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: form }
  )
  const data = await res.json() as any
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed')
  return { url: data.secure_url, publicId: data.public_id }
}
