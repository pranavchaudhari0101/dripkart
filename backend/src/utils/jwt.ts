import { SignJWT, jwtVerify } from 'jose'

export async function signToken(payload: Record<string, any>, secret: string, expiresIn = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(new TextEncoder().encode(secret))
}

export async function verifyToken(token: string, secret: string) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
  return payload
}
