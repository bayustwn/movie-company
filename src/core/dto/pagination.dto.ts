import { z } from "@/lib/zod-openapi";

export const PaginationDto = z.object({
    page: z.coerce.number().int().positive().optional().default(1).openapi({
        example: 1,
        description: "Page number",
    }),
    limit: z.coerce.number().int().positive().max(100).optional().default(10).openapi({
        example: 10,
        description: "Items per page (max 100)",
    }),
    sortBy: z.string().optional().openapi({
        example: "createdAt",
        description: "Field to sort by",
    }),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc").openapi({
        example: "desc",
        description: "Sort order",
    }),
});

export type PaginationDto = z.infer<typeof PaginationDto>;

export type Pagination = PaginationDto;

export const paginationSchema = PaginationDto;

export const PaginatedResponseDto = <T extends z.ZodTypeAny>(dataSchema: T) => {
    return z.object({
        success: z.boolean().openapi({ example: true }),
        data: z.array(dataSchema),
        pagination: z.object({
            page: z.number().openapi({ example: 1 }),
            limit: z.number().openapi({ example: 10 }),
            total: z.number().openapi({ example: 100 }),
            totalPages: z.number().openapi({ example: 10 }),
        }),
    });
};
