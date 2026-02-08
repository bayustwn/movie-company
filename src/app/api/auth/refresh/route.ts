import { NextRequest } from "next/server";
import { authService } from "@/services/auth.service";
import { refreshSchema } from "@/validators/auth.validator";
import { formatZodErrors } from "@/validators";
import { ServiceError } from "@/types";
import { successResponse, validationErrorResponse, errorResponse, serverErrorResponse } from "@/utils/response";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = refreshSchema.safeParse(body);
        if (!result.success) {
            return validationErrorResponse(formatZodErrors(result.error));
        }

        const tokens = await authService.refreshTokens(result.data);
        return successResponse(tokens, "Tokens refreshed successfully");

    } catch (error) {
        if (error instanceof ServiceError) {
            return errorResponse(error.message, error.statusCode);
        }
        return serverErrorResponse(error as Error);
    }
}
