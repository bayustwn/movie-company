import { NextResponse } from "next/server";
import { errorResponse } from "@/core";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions";
import type { Permission } from "@/core/permissions";
import type { JwtPayload } from "@/core";

export function requirePermission(user: JwtPayload, permission: Permission): NextResponse | null {
    if (!hasPermission(user.role, permission)) {
        return errorResponse(
            `Permission denied. Required permission: ${permission}`,
            403
        );
    }
    return null;
}

export function requireAnyPermission(user: JwtPayload, permissions: Permission[]): NextResponse | null {
    if (!hasAnyPermission(user.role, permissions)) {
        return errorResponse(
            `Permission denied. Required any of: ${permissions.join(", ")}`,
            403
        );
    }
    return null;
}

export function requireAllPermissions(user: JwtPayload, permissions: Permission[]): NextResponse | null {
    if (!hasAllPermissions(user.role, permissions)) {
        return errorResponse(
            `Permission denied. Required all of: ${permissions.join(", ")}`,
            403
        );
    }
    return null;
}
