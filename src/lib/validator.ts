import { z } from "zod";
import { ServiceError } from "@/core/errors";

export function validateRequest<T extends z.ZodTypeAny>(
    schema: T,
    data: unknown
): z.infer<T> {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.issues.forEach((issue) => {
            const path = issue.path.join(".");
            if (!errors[path]) errors[path] = [];
            errors[path].push(issue.message);
        });
        throw new ServiceError("Validation failed", 400, errors);
    }

    return result.data;
}
