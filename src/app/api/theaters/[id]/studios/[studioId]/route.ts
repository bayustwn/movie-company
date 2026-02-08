import { withPermission } from "@/middlewares/with-permission";
import { ok } from "@/lib/response-helpers";
import { validateRequest } from "@/lib/validator";
import { PERMISSIONS } from "@/core";
import { studioService, updateStudioSchema } from "@/features/theaters";

export const PATCH = withPermission<{ params: Promise<{ id: string; studioId: string }> }>(
    PERMISSIONS.THEATERS.UPDATE,
    async (request, { params }) => {
        const { id, studioId } = await params;
        const body = await request.json();
        const data = validateRequest(updateStudioSchema, body);

        const studio = await studioService.updateStudio(id, studioId, data);

        return ok(studio, "Studio updated successfully");
    }
);

export const DELETE = withPermission<{ params: Promise<{ id: string; studioId: string }> }>(
    PERMISSIONS.THEATERS.DELETE,
    async (request, { params }) => {
        const { id, studioId } = await params;
        await studioService.deleteStudio(id, studioId);

        return ok(null, "Studio deleted successfully");
    }
);
