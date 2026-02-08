import { withPermission } from "@/middlewares/with-permission";
import { PERMISSIONS } from "@/core/permissions";
import { validateRequest } from "@/lib/validator";
import { ok } from "@/lib/response-helpers";
import { handleError } from "@/core/errors";
import {
    getShowtimeById,
    updateShowtime,
    deleteShowtime,
    updateShowtimeSchema,
} from "@/features/showtimes";

export const GET = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.SHOWTIMES.READ,
    async (req, { params }) => {
        try {
            const { id } = await params;
            const showtime = await getShowtimeById(id);
            return ok(showtime);
        } catch (error) {
            return handleError(error);
        }
    }
);

export const PATCH = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.SHOWTIMES.UPDATE,
    async (req, { params }) => {
        try {
            const { id } = await params;
            const body = await req.json();
            const data = validateRequest(updateShowtimeSchema, body);
            const showtime = await updateShowtime(id, data);
            return ok(showtime, "Showtime updated successfully");
        } catch (error) {
            return handleError(error);
        }
    }
);

export const DELETE = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.SHOWTIMES.DELETE,
    async (req, { params }) => {
        try {
            const { id } = await params;
            await deleteShowtime(id);
            return ok(null, "Showtime deleted successfully");
        } catch (error) {
            return handleError(error);
        }
    }
);
