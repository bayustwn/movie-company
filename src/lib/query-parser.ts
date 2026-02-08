import { NextRequest } from "next/server";
import { z } from "zod";
import { validateRequest } from "./validator";

export function parseQueryParams<T extends z.ZodTypeAny>(
    request: NextRequest,
    schema: T
): z.infer<T> {
    const { searchParams } = new URL(request.url);

    const params: Record<string, any> = {};

    searchParams.forEach((value, key) => {
        params[key] = value || undefined;
    });

    return validateRequest(schema, params);
}

export function parseFiltersAndPagination<F extends z.ZodTypeAny, P extends z.ZodTypeAny>(
    request: NextRequest,
    filterSchema: F,
    paginationSchema: P
): { filters: z.infer<F>, pagination: z.infer<P> } {
    const { searchParams } = new URL(request.url);

    const allParams: Record<string, any> = {};
    searchParams.forEach((value, key) => {
        allParams[key] = value || undefined;
    });

    const filters = validateRequest(filterSchema, allParams);
    const pagination = validateRequest(paginationSchema, allParams);

    return { filters, pagination };
}
