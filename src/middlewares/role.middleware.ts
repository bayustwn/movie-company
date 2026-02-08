import { NextResponse } from "next/server";
import { errorResponse, JwtPayload } from "@/core";

export function requireRole(user: JwtPayload, allowedRoles: string[]): NextResponse | null {
    if (!allowedRoles.includes(user.role)) {
        return errorResponse("Insufficient permissions", 403);
    }
    return null;
}
