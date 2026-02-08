import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/middlewares/auth-helpers";
import { requireRole } from "@/middlewares/role.middleware";
import { validateRequest } from "@/lib/validator";
import { handleError } from "@/core/errors";
import { apiResponse } from "@/core/response";
import * as movieService from "@/features/movies/movies.service";
import { updateMovieSchema } from "@/features/movies/movies.validator";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const movie = await movieService.getMovieById(id);
        return NextResponse.json(apiResponse(movie));
    } catch (error) {
        return handleError(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await authenticate(request);
        if (authResult instanceof NextResponse) return authResult;

        const roleCheck = requireRole(authResult.user, ["ADMIN"]);
        if (roleCheck instanceof NextResponse) return roleCheck;

        const { id } = await params;
        const body = await request.json();
        const data = validateRequest(updateMovieSchema, body);

        const movie = await movieService.updateMovie(id, data);

        return NextResponse.json(apiResponse(movie, "Movie updated successfully"));
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await authenticate(request);
        if (authResult instanceof NextResponse) return authResult;

        const roleCheck = requireRole(authResult.user, ["ADMIN"]);
        if (roleCheck instanceof NextResponse) return roleCheck;

        const { id } = await params;
        await movieService.deleteMovie(id);

        return NextResponse.json(apiResponse(null, "Movie deleted successfully"));
    } catch (error) {
        return handleError(error);
    }
}
