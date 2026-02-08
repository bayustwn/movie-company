import { NextRequest } from "next/server";
import { withPermission } from "@/middlewares/with-permission";
import { created, paginated } from "@/lib/response-helpers";
import { parseFiltersAndPagination } from "@/lib/query-parser";
import { validateRequest } from "@/lib/validator";
import { PERMISSIONS } from "@/core";
import { theaterService, createTheaterSchema, theaterFilterSchema } from "@/features/theaters";
import { paginationSchema } from "@/core/dto/pagination.dto";

export async function GET(request: NextRequest) {
    const { filters, pagination } = parseFiltersAndPagination(
        request,
        theaterFilterSchema,
        paginationSchema
    );

    const result = await theaterService.getTheaters(filters, pagination);

    return paginated(result.data, result.pagination);
}

export const POST = withPermission(PERMISSIONS.THEATERS.CREATE, async (request) => {
    const body = await request.json();
    const data = validateRequest(createTheaterSchema, body);

    const theater = await theaterService.createTheater(data);

    return created(theater, "Theater created successfully");
});
