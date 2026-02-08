import { NextResponse } from "next/server";
import { errorResponse } from "@/core";
import type { AuthResult } from "./types/auth.types";

export type { AuthResult };

export async function authenticate(request: Request): Promise<AuthResult | NextResponse> {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return errorResponse("Authorization header required", 401);
    }

    const token = authHeader.split(" ")[1];
    const { verifyAccessToken } = await import("@/lib/auth");
    const decoded = verifyAccessToken(token);

    if (!decoded) {
        return errorResponse("Invalid or expired token", 401);
    }

    return { user: decoded };
}
