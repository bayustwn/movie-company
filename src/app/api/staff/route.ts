import { NextRequest } from "next/server";
import { withPermission } from "@/middlewares/with-permission";
import { parseFiltersAndPagination } from "@/lib/query-parser";
import { ok, created, paginated } from "@/lib/response-helpers";
import { validateRequest } from "@/lib/validator";
import { handleError, PERMISSIONS } from "@/core";
import { staffService, createStaffSchema, StaffFilterDto } from "@/features/staff";
import { PaginationDto } from "@/core/dto/pagination.dto";

const staffFilterSchema = StaffFilterDto;
const paginationSchema = PaginationDto;

export const GET = withPermission(
    PERMISSIONS.STAFF.READ,
    async (request) => {
        const { filters, pagination } = parseFiltersAndPagination(
            request,
            staffFilterSchema,
            paginationSchema
        );

        const result = await staffService.getAll(filters, pagination);

        return paginated(result.staff, result.pagination);
    }
);

export const POST = withPermission(
    PERMISSIONS.STAFF.CREATE,
    async (request) => {
        const body = await request.json();
        const data = validateRequest(createStaffSchema, body);

        const staff = await staffService.create(data);

        return created(staff, "Staff created successfully");
    }
);
