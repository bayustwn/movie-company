import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_CONFIG, BCRYPT_SALT_ROUNDS, BCRYPT_TOKEN_SALT_ROUNDS, JwtPayload, TokenPair } from "@/core";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret";

export type { JwtPayload, TokenPair };

export function generateAccessToken(
    payload: Omit<JwtPayload, "type">,
    rememberMe: boolean = false
): string {
    const expiresIn = rememberMe ? JWT_CONFIG.ACCESS_EXPIRY_REMEMBER : JWT_CONFIG.ACCESS_EXPIRY;
    const options: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };
    return jwt.sign({ ...payload, type: "access" }, JWT_ACCESS_SECRET, options);
}

export function generateRefreshToken(
    payload: Omit<JwtPayload, "type">,
    rememberMe: boolean = false
): string {
    const expiresIn = rememberMe ? JWT_CONFIG.REFRESH_EXPIRY_REMEMBER : JWT_CONFIG.REFRESH_EXPIRY;
    const options: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };
    return jwt.sign({ ...payload, type: "refresh" }, JWT_REFRESH_SECRET, options);
}

export function generateTokenPair(
    payload: Omit<JwtPayload, "type">,
    rememberMe: boolean = false
): TokenPair {
    return {
        accessToken: generateAccessToken(payload, rememberMe),
        refreshToken: generateRefreshToken(payload, rememberMe),
    };
}

export function verifyAccessToken(token: string): JwtPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
        if (decoded.type !== "access") return null;
        return decoded;
    } catch {
        return null;
    }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
        if (decoded.type !== "refresh") return null;
        return decoded;
    } catch {
        return null;
    }
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export async function hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, BCRYPT_TOKEN_SALT_ROUNDS);
}

export async function compareToken(
    token: string,
    hashedToken: string
): Promise<boolean> {
    return bcrypt.compare(token, hashedToken);
}
