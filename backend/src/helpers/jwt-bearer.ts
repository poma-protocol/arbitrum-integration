import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { JwtPayload } from '../types';
class JwtBearer {

    private readonly JWT_SECRET: string;
    private readonly JWT_EXPIRY: number;

    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET as string;
        this.JWT_EXPIRY = 60 * 60 * 3;
        if (!this.JWT_SECRET) {
            throw new Error("JWT_SECRET is not set in environment variables");
        }
    }
    encodeJwt(args: { email: string, userId: number }): string {

        const payload: JwtPayload = {
            email: args.email,
            userId: args.userId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + this.JWT_EXPIRY
        };

        const token = jwt.sign(payload, this.JWT_SECRET, { algorithm: 'HS256' });
        return token;
    }

    decodeJwt(token: string): JwtPayload | null {
        try {
            const decoded = jwt.decode(token);
            if (!decoded || typeof decoded !== 'object') return null;

            return decoded as JwtPayload;
        } catch (err) {
            console.error('Failed to decode JWT', err);
            return null;
        }

    }
    verifyJwt(token: string): boolean {
        try {
            jwt.verify(token, this.JWT_SECRET);
            return true;
        } catch (err) {
            console.warn('JWT verification failed:', err);
            return false;
        }
    }
    async authenticate(request: Request): Promise<JwtPayload | null> {
        const authHeader = request.headers['authorization'] || request.headers['Authorization'];
        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) return null;
        const token = authHeader.split(' ')[1];
        try {
            if (!this.verifyJwt(token)) return null;
            const payload = this.decodeJwt(token);
            return payload ?? null;
        } catch {
            return null;
        }
    }
}
export const jwtBearer = new JwtBearer();