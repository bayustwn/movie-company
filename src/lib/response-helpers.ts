import { NextResponse } from "next/server";

export interface SuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T = any> {
    success: true;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export function ok<T>(data: T, message?: string, status = 200): NextResponse {
    return NextResponse.json(
        {
            success: true,
            data,
            message,
        } as SuccessResponse<T>,
        { status }
    );
}

export function created<T>(data: T, message = "Created successfully"): NextResponse {
    return ok(data, message, 201);
}

export function paginated<T>(
    data: T[],
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
): NextResponse {
    return NextResponse.json({
        success: true,
        data,
        pagination,
    } as PaginatedResponse<T>);
}
