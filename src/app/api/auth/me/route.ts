import { NextRequest } from "next/server";
import { withAuth } from "@/middlewares/with-permission";
import { ok } from "@/lib/response-helpers";
import { authService } from "@/features/auth";

export const GET = withAuth(async (request, context, user) => {
    const userData = await authService.getUserById(user.userId);
    return ok({ user: userData });
});
