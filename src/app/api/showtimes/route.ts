import { NextRequest } from "next/server";
import { withPermission } from "@/middlewares/with-permission";
import { PERMISSIONS } from "@/core/permissions";
import { validateRequest } from "@/lib/validator";
import { created, paginated } from "@/lib/response-helpers";
import { parseFiltersAndPagination } from "@/lib/query-parser";
import { handleError } from "@/core/errors";
import {
    createShowtime,
    getShowtimes,
    createShowtimeSchema,
    showtimeFilterSchema,
} from "@/features/showtimes";
import { paginationSchema } from "@/core/dto/pagination.dto";

export const GET = withPermission(PERMISSIONS.SHOWTIMES.READ, async (req: NextRequest) => {
    try {
        const { filters, pagination } = parseFiltersAndPagination(
            req,
            showtimeFilterSchema,
            paginationSchema
        );
        const result = await getShowtimes(filters, pagination);
        return paginated(result.data, result.pagination);
    } catch (error) {
        return handleError(error);
    }
});

export const POST = withPermission(PERMISSIONS.SHOWTIMES.CREATE, async (req: NextRequest) => {
    try {
        const body = await req.json();
        const data = validateRequest(createShowtimeSchema, body);
        const showtime = await createShowtime(data);
        return created(showtime, "Showtime created successfully");
    } catch (error) {
        return handleError(error);
    }
});
