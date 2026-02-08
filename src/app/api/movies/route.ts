import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/middlewares/with-permission";
import { parseFiltersAndPagination } from "@/lib/query-parser";
import { ok, created, paginated } from "@/lib/response-helpers";
import { validateRequest } from "@/lib/validator";
import { handleError, PERMISSIONS } from "@/core";
import * as movieService from "@/features/movies/movies.service";
import { createMovieSchema, movieFilterSchema, paginationSchema } from "@/features/movies/movies.validator";

export async function GET(request: NextRequest) {
    try {
        const { filters, pagination } = parseFiltersAndPagination(
            request,
            movieFilterSchema,
            paginationSchema
        );

        const result = await movieService.getMovies(filters, pagination);

        return paginated(result.movies, result.pagination);
    } catch (error) {
        return handleError(error);
    }
}

export const POST = withPermission(
    PERMISSIONS.MOVIES.CREATE,
    async (request) => {
        const body = await request.json();
        const data = validateRequest(createMovieSchema, body);

        const movie = await movieService.createMovie(data);

        return created(movie, "Movie created successfully");
    }
);
