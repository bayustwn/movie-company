import { NextRequest } from "next/server";
import { withPermission } from "@/middlewares/with-permission";
import { ok } from "@/lib/response-helpers";
import { PERMISSIONS } from "@/core";
import { ServiceError } from "@/core/errors";
import * as movieService from "@/features/movies/movies.service";
import { fileUploadSchema } from "@/features/movies/movies.validator";

export const POST = withPermission(
    PERMISSIONS.MOVIES.UPDATE,
    async (request, { params }) => {
        const { id } = await params;
        const formData = await request.formData();
        const poster = formData.get("poster");

        if (!poster || !(poster instanceof File)) {
            throw new ServiceError("Poster file is required", 400);
        }

        const result = fileUploadSchema.safeParse({ poster });
        if (!result.success) {
            const errors: Record<string, string[]> = {};
            result.error.issues.forEach((err) => {
                const path = err.path.join(".");
                if (!errors[path]) errors[path] = [];
                errors[path].push(err.message);
            });
            throw new ServiceError("File validation failed", 400, errors);
        }

        const buffer = Buffer.from(await poster.arrayBuffer());
        const movie = await movieService.uploadMoviePoster(id, buffer);

        return ok(movie, "Poster uploaded successfully");
    }
);
