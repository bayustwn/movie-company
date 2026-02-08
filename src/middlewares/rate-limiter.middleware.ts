import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextRequest } from "next/server";
import { errorResponse } from "@/core";

const rateLimiterAuth = new RateLimiterMemory({
    points: 5,
    duration: 60,
    blockDuration: 60 * 5,
});

const rateLimiterGeneral = new RateLimiterMemory({
    points: 100,
    duration: 60,
});

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return request.headers.get("x-real-ip") || "unknown";
}

export async function authRateLimiter(request: NextRequest) {
    const ip = getClientIp(request);

    try {
        await rateLimiterAuth.consume(ip);
        return null;
    } catch {
        return errorResponse("Too many login attempts. Please try again later.", 429);
    }
}

export async function generalRateLimiter(request: NextRequest) {
    const ip = getClientIp(request);

    try {
        await rateLimiterGeneral.consume(ip);
        return null;
    } catch {
        return errorResponse("Too many requests. Please slow down.", 429);
    }
}
