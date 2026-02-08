import { NextRequest } from "next/server";
import { withPermission } from "@/middlewares/with-permission";
import { ok } from "@/lib/response-helpers";
import { validateRequest } from "@/lib/validator";
import { handleError, PERMISSIONS } from "@/core";
import * as movieService from "@/features/movies/movies.service";
import { updateMovieSchema } from "@/features/movies/movies.validator";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const movie = await movieService.getMovieById(id);
        return ok(movie);
    } catch (error) {
        return handleError(error);
    }
}

export const PATCH = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.MOVIES.UPDATE,
    async (request, { params }) => {
        const { id } = await params;
        const body = await request.json();
        const data = validateRequest(updateMovieSchema, body);

        const movie = await movieService.updateMovie(id, data);

        return ok(movie, "Movie updated successfully");
    }
);

export const DELETE = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.MOVIES.DELETE,
    async (request, { params }) => {
        const { id } = await params;
        await movieService.deleteMovie(id);

        return ok(null, "Movie deleted successfully");
    }
);
