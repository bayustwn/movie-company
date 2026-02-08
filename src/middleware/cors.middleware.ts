import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "*").split(",").map(o => o.trim());

export function corsHeaders(origin?: string | null): HeadersInit {
    const headers: HeadersInit = {
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
    };

    if (ALLOWED_ORIGINS.includes("*")) {
        headers["Access-Control-Allow-Origin"] = "*";
    } else if (origin && ALLOWED_ORIGINS.includes(origin)) {
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Access-Control-Allow-Credentials"] = "true";
    }

    return headers;
}

export function handleCorsPrelight(request: NextRequest): NextResponse | null {
    if (request.method === "OPTIONS") {
        const origin = request.headers.get("origin");
        return new NextResponse(null, {
            status: 204,
            headers: corsHeaders(origin),
        });
    }
    return null;
}

export function withCors(response: NextResponse, origin?: string | null): NextResponse {
    const headers = corsHeaders(origin);
    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}
