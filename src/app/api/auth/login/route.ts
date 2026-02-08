import { NextRequest } from "next/server";
import { authService, loginSchema, formatZodErrors } from "@/features/auth";
import { ServiceError, successResponse, validationErrorResponse, errorResponse, serverErrorResponse } from "@/core";
import { authRateLimiter } from "@/middleware/rate-limiter.middleware";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    const rateLimitResponse = await authRateLimiter(request);
    if (rateLimitResponse) {
        logger.warn("Rate limit exceeded on login", { path: "/api/auth/login" });
        return rateLimitResponse;
    }

    try {
        const body = await request.json();

        const result = loginSchema.safeParse(body);
        if (!result.success) {
            return validationErrorResponse(formatZodErrors(result.error));
        }

        const authResult = await authService.login(result.data);

        logger.request(request, 200, Date.now() - startTime, authResult.user.id);
        return successResponse(authResult, "Login successful");

    } catch (error) {
        if (error instanceof ServiceError) {
            logger.warn("Login failed", { path: "/api/auth/login" });
            return errorResponse(error.message, error.statusCode);
        }
        logger.error("Login error", error as Error);
        return serverErrorResponse(error as Error);
    }
}
