import { NextRequest } from "next/server";
import { withAuth } from "@/middlewares/with-permission";
import { ok } from "@/lib/response-helpers";
import { authService } from "@/features/auth";

export const POST = withAuth(async (request, context, user) => {
    await authService.logout(user.userId);
    return ok(null, "Logged out successfully");
});
