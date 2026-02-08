import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/middlewares/auth-helpers";
import { requireRole } from "@/middlewares/role.middleware";
import { validateRequest } from "@/lib/validator";
import { handleError } from "@/core/errors";
import { apiResponse } from "@/core/response";
import * as movieService from "@/features/movies/movies.service";
import { createMovieSchema, movieFilterSchema, paginationSchema } from "@/features/movies/movies.validator";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = validateRequest(movieFilterSchema, {
            genre: searchParams.get("genre") || undefined,
            rating: searchParams.get("rating") || undefined,
            isActive: searchParams.get("isActive") || undefined,
            search: searchParams.get("search") || undefined,
        });

        const pagination = validateRequest(paginationSchema, {
            page: searchParams.get("page") || undefined,
            limit: searchParams.get("limit") || undefined,
            sortBy: searchParams.get("sortBy") || undefined,
            sortOrder: searchParams.get("sortOrder") || undefined,
        });

        const result = await movieService.getMovies(filters, pagination);

        return NextResponse.json({
            success: true,
            data: result.movies,
            pagination: result.pagination,
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const authResult = await authenticate(request);
        if (authResult instanceof NextResponse) return authResult;

        const roleCheck = requireRole(authResult.user, ["ADMIN"]);
        if (roleCheck instanceof NextResponse) return roleCheck;

        const body = await request.json();
        const data = validateRequest(createMovieSchema, body);

        const movie = await movieService.createMovie(data);

        return NextResponse.json(
            apiResponse(movie, "Movie created successfully"),
            { status: 201 }
        );
    } catch (error) {
        return handleError(error);
    }
}
