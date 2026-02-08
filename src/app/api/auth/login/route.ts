import { NextRequest } from "next/server";
import { authService } from "@/services/auth.service";
import { loginSchema } from "@/validators/auth.validator";
import { formatZodErrors } from "@/validators";
import { ServiceError } from "@/types";
import { successResponse, validationErrorResponse, errorResponse, serverErrorResponse } from "@/utils/response";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = loginSchema.safeParse(body);
        if (!result.success) {
            return validationErrorResponse(formatZodErrors(result.error));
        }

        const authResult = await authService.login(result.data);
        return successResponse(authResult, "Login successful");

    } catch (error) {
        if (error instanceof ServiceError) {
            return errorResponse(error.message, error.statusCode);
        }
        return serverErrorResponse(error as Error);
    }
}
