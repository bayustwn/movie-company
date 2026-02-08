import { NextRequest } from "next/server";
import { withPermission } from "@/middlewares/with-permission";
import { ok, created } from "@/lib/response-helpers";
import { validateRequest } from "@/lib/validator";
import { handleError, PERMISSIONS } from "@/core";
import { studioService, createStudioSchema } from "@/features/theaters";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const studios = await studioService.getStudiosByTheater(id);
        return ok(studios);
    } catch (error) {
        return handleError(error);
    }
}

export const POST = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.THEATERS.CREATE,
    async (request, { params }) => {
        const { id } = await params;
        const body = await request.json();
        const data = validateRequest(createStudioSchema, body);

        const studio = await studioService.createStudio(id, data);

        return created(studio, "Studio created successfully");
    }
);
