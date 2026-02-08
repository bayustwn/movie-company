import { ZodSchema, ZodError } from "zod";
import { ServiceError } from "@/core/errors";

export function validateRequest<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors: Record<string, string[]> = {};

        result.error.issues.forEach((err) => {
            const path = err.path.join(".");
            if (!errors[path]) {
                errors[path] = [];
            }
            errors[path].push(err.message);
        });

        throw new ServiceError("Validation failed", 400, errors);
    }

    return result.data;
}
