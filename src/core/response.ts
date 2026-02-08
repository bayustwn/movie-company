import { NextResponse } from "next/server";
import { ApiResponse } from "./types";

export function successResponse<T>(
    data: T,
    message?: string,
    status: number = 200
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            message,
            data,
        },
        { status }
    );
}

export function errorResponse(
    error: string,
    status: number = 400,
    errors?: Record<string, string[]>
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error,
            errors,
        },
        { status }
    );
}

export function validationErrorResponse(
    errors: Record<string, string[]>
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error: "Validation failed",
            errors,
        },
        { status: 400 }
    );
}

export function serverErrorResponse(
    error?: Error
): NextResponse<ApiResponse> {
    console.error("Server error:", error);
    return NextResponse.json(
        {
            success: false,
            error: "Internal server error",
        },
        { status: 500 }
    );
}
