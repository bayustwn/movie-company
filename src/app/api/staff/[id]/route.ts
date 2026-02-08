import { withPermission } from "@/middlewares/with-permission";
import { ok } from "@/lib/response-helpers";
import { validateRequest } from "@/lib/validator";
import { PERMISSIONS } from "@/core";
import { staffService, updateStaffSchema } from "@/features/staff";

export const GET = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.STAFF.READ,
    async (request, { params }) => {
        const { id } = await params;
        const staff = await staffService.getById(id);
        return ok(staff);
    }
);

export const PATCH = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.STAFF.UPDATE,
    async (request, { params }) => {
        const { id } = await params;
        const body = await request.json();
        const data = validateRequest(updateStaffSchema, body);

        const staff = await staffService.update(id, data);

        return ok(staff, "Staff updated successfully");
    }
);

export const DELETE = withPermission<{ params: Promise<{ id: string }> }>(
    PERMISSIONS.STAFF.DELETE,
    async (request, { params }) => {
        const { id } = await params;
        await staffService.delete(id);

        return ok(null, "Staff deleted successfully");
    }
);
