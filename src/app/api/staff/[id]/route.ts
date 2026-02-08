import { NextRequest } from "next/server";
import { withPermission } from "@/middlewares/with-permission";
import { ok } from "@/lib/response-helpers";
import { validateRequest } from "@/lib/validator";
import { handleError, PERMISSIONS } from "@/core";
import { staffService, updateStaffSchema } from "@/features/staff";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export const GET = withPermission(
    PERMISSIONS.STAFF.READ,
    async (request, { params }: RouteParams) => {
        const { id } = await params;
        const staff = await staffService.getById(id);
        return ok(staff);
    }
);

export const PATCH = withPermission(
    PERMISSIONS.STAFF.UPDATE,
    async (request, { params }: RouteParams) => {
        const { id } = await params;
        const body = await request.json();
        const data = validateRequest(updateStaffSchema, body);

        const staff = await staffService.update(id, data);

        return ok(staff, "Staff updated successfully");
    }
);

export const DELETE = withPermission(
    PERMISSIONS.STAFF.DELETE,
    async (request, { params }: RouteParams) => {
        const { id } = await params;
        await staffService.delete(id);

        return ok(null, "Staff deleted successfully");
    }
);
