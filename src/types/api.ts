export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    errors?: Record<string, string[]>;
}

export class ServiceError extends Error {
    constructor(
        message: string,
        public statusCode: number = 400
    ) {
        super(message);
        this.name = "ServiceError";
    }
}
