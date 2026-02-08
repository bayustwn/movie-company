import { NextRequest } from "next/server";
import { authService } from "@/features/auth";
import { withAuth, AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { ServiceError, successResponse, errorResponse, serverErrorResponse } from "@/core";

export async function GET(request: NextRequest) {
    return withAuth(request, async (authReq: AuthenticatedRequest) => {
        try {
            const user = await authService.getUserById(authReq.user.userId);
            return successResponse({ user });
        } catch (error) {
            if (error instanceof ServiceError) {
                return errorResponse(error.message, error.statusCode);
            }
            return serverErrorResponse(error as Error);
        }
    });
}
