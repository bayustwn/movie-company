import { z } from "@/lib/zod-openapi";

export const CreateTheaterDto = z
    .object({
        name: z.string().min(1).max(100).openapi({
            example: "Grand Indonesia XXI",
            description: "Theater name",
        }),
        address: z.string().min(1).openapi({
            example: "Jl. MH Thamrin No.1, Jakarta Pusat",
            description: "Full address",
        }),
        city: z.string().min(1).max(50).openapi({
            example: "Jakarta",
            description: "City name",
        }),
        phone: z.string().optional().openapi({
            example: "021-12345678",
            description: "Contact phone number",
        }),
    })
    .openapi("CreateTheaterDto");

export const UpdateTheaterDto = CreateTheaterDto.partial().openapi("UpdateTheaterDto");

export const TheaterResponseDto = z
    .object({
        id: z.string().openapi({ example: "cm5xabc123" }),
        name: z.string().openapi({ example: "Grand Indonesia XXI" }),
        slug: z.string().openapi({ example: "grand-indonesia-xxi" }),
        address: z.string().openapi({ example: "Jl. MH Thamrin No.1, Jakarta Pusat" }),
        city: z.string().openapi({ example: "Jakarta" }),
        phone: z.string().nullable().openapi({ example: "021-12345678" }),
        isActive: z.boolean().openapi({ example: true }),
        createdAt: z.date().openapi({ example: "2024-01-01T00:00:00Z" }),
        updatedAt: z.date().openapi({ example: "2024-01-01T00:00:00Z" }),
    })
    .openapi("TheaterResponseDto");

export const TheaterFilterDto = z
    .object({
        city: z.string().optional().openapi({
            example: "Jakarta",
            description: "Filter by city",
        }),
        search: z.string().optional().openapi({
            example: "Grand",
            description: "Search in name or address",
        }),
        isActive: z
            .string()
            .optional()
            .transform((val) => (val === "true" ? true : val === "false" ? false : undefined))
            .openapi({
                example: "true",
                description: "Filter by active status",
            }),
    })
    .openapi("TheaterFilterDto");

export type CreateTheater = z.infer<typeof CreateTheaterDto>;
export type UpdateTheater = z.infer<typeof UpdateTheaterDto>;
export type TheaterResponse = z.infer<typeof TheaterResponseDto>;
export type TheaterFilter = z.infer<typeof TheaterFilterDto>;
