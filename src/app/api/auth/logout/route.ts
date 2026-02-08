import { NextRequest } from "next/server";
import { authService } from "@/features/auth";
import { withAuth, AuthenticatedRequest } from "@/middleware/auth.middleware";
import { ServiceError, successResponse, errorResponse, serverErrorResponse } from "@/core";

export async function POST(request: NextRequest) {
    return withAuth(request, async (authReq: AuthenticatedRequest) => {
        try {
            await authService.logout(authReq.user.userId);
            return successResponse(null, "Logged out successfully");
        } catch (error) {
            if (error instanceof ServiceError) {
                return errorResponse(error.message, error.statusCode);
            }
            return serverErrorResponse(error as Error);
        }
    });
}
