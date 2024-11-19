import { jwtVerify, SignJWT } from 'jose';
import { JWTPayload } from './types';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(payload:Omit<JWTPayload, 'iat' | 'exp'>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}