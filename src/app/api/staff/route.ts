import { staffService, createStaffSchema } from "@/features/staff";
import { formatZodErrors } from "@/features/auth";
import { createProtectedHandler, AuthenticatedRequest } from "@/middleware/auth.middleware";
import { UserResponse, ServiceError, successResponse, validationErrorResponse, errorResponse, serverErrorResponse } from "@/core";

export const GET = createProtectedHandler(
    async () => {
        try {
            const staff = await staffService.getAll();
            return successResponse<UserResponse[]>(staff);
        } catch (error) {
            return serverErrorResponse(error as Error);
        }
    },
    ["ADMIN"]
);

export const POST = createProtectedHandler(
    async (req: AuthenticatedRequest) => {
        try {
            const body = await req.json();

            const result = createStaffSchema.safeParse(body);
            if (!result.success) {
                return validationErrorResponse(formatZodErrors(result.error));
            }

            const staff = await staffService.create(result.data);
            return successResponse(staff, "Staff created successfully", 201);
        } catch (error) {
            if (error instanceof ServiceError) {
                return errorResponse(error.message, error.statusCode);
            }
            return serverErrorResponse(error as Error);
        }
    },
    ["ADMIN"]
);
