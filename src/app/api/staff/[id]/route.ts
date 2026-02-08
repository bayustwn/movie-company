import { NextRequest } from "next/server";
import { staffService, updateStaffSchema } from "@/features/staff";
import { formatZodErrors } from "@/features/auth";
import { createProtectedHandler, AuthenticatedRequest } from "@/middleware/auth.middleware";
import { UserResponse, ServiceError, successResponse, validationErrorResponse, errorResponse, serverErrorResponse } from "@/core";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    const handler = createProtectedHandler(
        async () => {
            try {
                const { id } = await params;
                const staff = await staffService.getById(id);
                return successResponse<UserResponse>(staff);
            } catch (error) {
                if (error instanceof ServiceError) {
                    return errorResponse(error.message, error.statusCode);
                }
                return serverErrorResponse(error as Error);
            }
        },
        ["ADMIN"]
    );
    return handler(request);
}

export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    const handler = createProtectedHandler(
        async (req: AuthenticatedRequest) => {
            try {
                const { id } = await params;
                const body = await req.json();

                const result = updateStaffSchema.safeParse(body);
                if (!result.success) {
                    return validationErrorResponse(formatZodErrors(result.error));
                }

                const staff = await staffService.update(id, result.data);
                return successResponse(staff, "Staff updated successfully");
            } catch (error) {
                if (error instanceof ServiceError) {
                    return errorResponse(error.message, error.statusCode);
                }
                return serverErrorResponse(error as Error);
            }
        },
        ["ADMIN"]
    );
    return handler(request);
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    const handler = createProtectedHandler(
        async () => {
            try {
                const { id } = await params;
                await staffService.delete(id);
                return successResponse(null, "Staff deleted successfully");
            } catch (error) {
                if (error instanceof ServiceError) {
                    return errorResponse(error.message, error.statusCode);
                }
                return serverErrorResponse(error as Error);
            }
        },
        ["ADMIN"]
    );
    return handler(request);
}
