import { NextRequest } from "next/server";
import { staffService, createStaffSchema, StaffFilterDto } from "@/features/staff";
import { formatZodErrors } from "@/features/auth";
import { createProtectedHandler, AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { requirePermission } from "@/middlewares/permission.middleware";
import { validateRequest } from "@/lib/validator";
import { PaginationDto } from "@/core/dto/pagination.dto";
import { UserResponse, ServiceError, successResponse, validationErrorResponse, errorResponse, serverErrorResponse, PERMISSIONS } from "@/core";

const staffFilterSchema = StaffFilterDto;
const paginationSchema = PaginationDto;

export const GET = createProtectedHandler(
    async (req: NextRequest) => {
        try {
            const { searchParams } = new URL(req.url);

            const filters = validateRequest(staffFilterSchema, {
                role: searchParams.get("role") || undefined,
                search: searchParams.get("search") || undefined,
            });

            const pagination = validateRequest(paginationSchema, {
                page: searchParams.get("page") || undefined,
                limit: searchParams.get("limit") || undefined,
                sortBy: searchParams.get("sortBy") || undefined,
                sortOrder: searchParams.get("sortOrder") || undefined,
            });

            const result = await staffService.getAll(filters, pagination);

            return successResponse({
                data: result.staff,
                pagination: result.pagination,
            });
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
