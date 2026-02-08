import { NextRequest, NextResponse } from "next/server";
import { authenticate, AuthResult } from "./auth-helpers";
import { requirePermission, requireAnyPermission, requireAllPermissions } from "./permission.middleware";
import { handleError } from "@/core";
import type { Permission } from "@/core/permissions";

export interface AuthenticatedHandler<T = any> {
    (request: NextRequest, context: T, user: AuthResult["user"]): Promise<NextResponse>;
}

export function withPermission<T = any>(
    permission: Permission,
    handler: AuthenticatedHandler<T>
) {
    return async (request: NextRequest, context: T) => {
        try {
            const authResult = await authenticate(request);
            if (authResult instanceof NextResponse) return authResult;

            const permissionError = requirePermission(authResult.user, permission);
            if (permissionError) return permissionError;

            return await handler(request, context, authResult.user);
        } catch (error) {
            return handleError(error);
        }
    };
}

export function withAnyPermission<T = any>(
    permissions: Permission[],
    handler: AuthenticatedHandler<T>
) {
    return async (request: NextRequest, context: T) => {
        try {
            const authResult = await authenticate(request);
            if (authResult instanceof NextResponse) return authResult;

            const permissionError = requireAnyPermission(authResult.user, permissions);
            if (permissionError) return permissionError;

            return await handler(request, context, authResult.user);
        } catch (error) {
            return handleError(error);
        }
    };
}

export function withAllPermissions<T = any>(
    permissions: Permission[],
    handler: AuthenticatedHandler<T>
) {
    return async (request: NextRequest, context: T) => {
        try {
            const authResult = await authenticate(request);
            if (authResult instanceof NextResponse) return authResult;

            const permissionError = requireAllPermissions(authResult.user, permissions);
            if (permissionError) return permissionError;

            return await handler(request, context, authResult.user);
        } catch (error) {
            return handleError(error);
        }
    };
}

export function withAuth<T = any>(
    handler: AuthenticatedHandler<T>
) {
    return async (request: NextRequest, context: T) => {
        try {
            const authResult = await authenticate(request);
            if (authResult instanceof NextResponse) return authResult;

            return await handler(request, context, authResult.user);
        } catch (error) {
            return handleError(error);
        }
    };
}
