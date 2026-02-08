import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/middlewares/auth-helpers";
import { requireRole } from "@/middlewares/role.middleware";
import { handleError, ServiceError } from "@/core/errors";
import { apiResponse } from "@/core/response";
import * as movieService from "@/features/movies/movies.service";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await authenticate(request);
        if (authResult instanceof NextResponse) return authResult;

        const roleCheck = requireRole(authResult.user, ["ADMIN"]);
        if (roleCheck instanceof NextResponse) return roleCheck;

        const { id } = await params;
        const formData = await request.formData();
        const file = formData.get("poster") as File;

        if (!file) {
            throw new ServiceError("Poster file is required", 400);
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new ServiceError("File size must be less than 5MB", 400);
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            throw new ServiceError("File must be JPEG, PNG, or WebP", 400);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const movie = await movieService.uploadMoviePoster(id, buffer);

        return NextResponse.json(apiResponse(movie, "Poster uploaded successfully"));
    } catch (error) {
        return handleError(error);
    }
}
