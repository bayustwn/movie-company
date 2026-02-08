import { NextRequest, NextResponse } from "next/server";
import { handleCorsPrelight, withCors } from "./middleware/cors.middleware";

export function middleware(request: NextRequest) {
    const corsPreflightResponse = handleCorsPrelight(request);
    if (corsPreflightResponse) {
        return corsPreflightResponse;
    }

    const response = NextResponse.next();
    const origin = request.headers.get("origin");
    return withCors(response, origin);
}

export const config = {
    matcher: "/api/:path*",
};
