import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { errorResponse, JwtPayload } from "@/core";

export interface AuthenticatedRequest extends NextRequest {
    user: JwtPayload;
}

export async function withAuth(
    request: NextRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return errorResponse("Authorization header required", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
        return errorResponse("Invalid or expired token", 401);
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = decoded;

    return handler(authenticatedRequest);
}

export function withRole(
    allowedRoles: string[],
    request: AuthenticatedRequest
): NextResponse | null {
    if (!allowedRoles.includes(request.user.role)) {
        return errorResponse("Insufficient permissions", 403);
    }
    return null;
}

export function createProtectedHandler(
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
    allowedRoles?: string[]
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        return withAuth(request, async (authReq) => {
            if (allowedRoles) {
                const roleError = withRole(allowedRoles, authReq);
                if (roleError) return roleError;
            }
            return handler(authReq);
        });
    };
}
