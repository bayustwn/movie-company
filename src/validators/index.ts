import { z } from "zod";

export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!errors[path]) {
            errors[path] = [];
        }
        errors[path].push(err.message);
    });

    return errors;
}

export const emailSchema = z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format");

export const passwordSchema = z
    .string()
    .min(6, "Password must be at least 6 characters");

export const nameSchema = z
    .string()
    .min(1, "Name is required");

export const roleSchema = z.enum(["ADMIN", "STAFF"]);
