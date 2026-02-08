import { NextRequest } from "next/server";
import { authService } from "@/services/auth.service";
import { withAuth, AuthenticatedRequest } from "@/middleware/auth.middleware";
import { ServiceError } from "@/types";
import { successResponse, errorResponse, serverErrorResponse } from "@/utils/response";

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
