import { z } from "@/lib/zod-openapi";

export function ApiResponseDto<T extends z.ZodTypeAny>(dataSchema: T) {
    return z.object({
        success: z.boolean().openapi({ example: true }),
        message: z.string().optional().openapi({ example: "Operation successful" }),
        data: dataSchema.optional(),
    });
}

export const ErrorResponseDto = z.object({
    success: z.boolean().openapi({ example: false }),
    error: z.string().openapi({ example: "Invalid credentials" }),
    errors: z.record(z.string(), z.array(z.string())).optional().openapi({
        example: { email: ["Invalid email format"] }
    }),
}).openapi("ErrorResponse");

export type ErrorResponseDto = z.infer<typeof ErrorResponseDto>;

export const ValidationErrorResponseDto = z.object({
    success: z.boolean().openapi({ example: false }),
    error: z.string().openapi({ example: "Validation failed" }),
    errors: z.record(z.string(), z.array(z.string())).openapi({
        example: {
            email: ["Email is required", "Invalid email format"],
            password: ["Password must be at least 6 characters"]
        }
    }),
}).openapi("ValidationErrorResponse");

export type ValidationErrorResponseDto = z.infer<typeof ValidationErrorResponseDto>;

export const UserDto = z.object({
    id: z.string().openapi({ example: "cm5xabc123" }),
    email: z.string().email().openapi({ example: "admin@cinema.com" }),
    name: z.string().openapi({ example: "Admin User" }),
    role: z.enum(["ADMIN", "STAFF"]).openapi({ example: "ADMIN" }),
    createdAt: z.date().optional().openapi({ example: "2024-01-01T00:00:00Z" }),
    updatedAt: z.date().optional().openapi({ example: "2024-01-01T00:00:00Z" }),
}).openapi("User");

export type UserDto = z.infer<typeof UserDto>;
