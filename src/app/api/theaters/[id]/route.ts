import { NextRequest } from "next/server";
import { withPermission } from "@/middlewares/with-permission";
import { ok } from "@/lib/response-helpers";
import { validateRequest } from "@/lib/validator";
import { handleError, PERMISSIONS } from "@/core";
import { theaterService, updateTheaterSchema } from "@/features/theaters";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const theater = await theaterService.getTheaterById(id);
        return ok(theater);
    } catch (error) {
        return handleError(error);
    }
}

export const PATCH = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.THEATERS.UPDATE,
    async (request, { params }) => {
        const { id } = await params;
        const body = await request.json();
        const data = validateRequest(updateTheaterSchema, body);

        const theater = await theaterService.updateTheater(id, data);

        return ok(theater, "Theater updated successfully");
    }
);

export const DELETE = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.THEATERS.DELETE,
    async (request, { params }) => {
        const { id } = await params;
        await theaterService.deleteTheater(id);

        return ok(null, "Theater deleted successfully");
    }
);
