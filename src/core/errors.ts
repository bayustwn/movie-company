import { NextResponse } from "next/server";

export class ServiceError extends Error {
    constructor(
        message: string,
        public statusCode: number = 400,
        public errors?: Record<string, string[]>
    ) {
        super(message);
        this.name = "ServiceError";
    }
}

export function handleError(error: unknown) {
    if (error instanceof ServiceError) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                ...(error.errors && { errors: error.errors }),
            },
            { status: error.statusCode }
        );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
        {
            success: false,
            error: "Internal server error",
        },
        { status: 500 }
    );
}
