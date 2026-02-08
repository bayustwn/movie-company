import { z } from "@/lib/zod-openapi";

export const CreateStudioDto = z
    .object({
        name: z.string().min(1).max(50).openapi({
            example: "Studio 1",
            description: "Studio name",
        }),
        capacity: z.number().int().min(1).max(1000).openapi({
            example: 150,
            description: "Total seat capacity",
        }),
        price: z.number().int().min(0).openapi({
            example: 50000,
            description: "Base ticket price in IDR",
        }),
    })
    .openapi("CreateStudioDto");

export const UpdateStudioDto = CreateStudioDto.partial().openapi("UpdateStudioDto");

export const StudioResponseDto = z
    .object({
        id: z.string().openapi({ example: "cm5xdef456" }),
        name: z.string().openapi({ example: "Studio 1" }),
        theaterId: z.string().openapi({ example: "cm5xabc123" }),
        capacity: z.number().openapi({ example: 150 }),
        price: z.number().openapi({ example: 50000 }),
        createdAt: z.date().openapi({ example: "2024-01-01T00:00:00Z" }),
        updatedAt: z.date().openapi({ example: "2024-01-01T00:00:00Z" }),
    })
    .openapi("StudioResponseDto");

export type CreateStudio = z.infer<typeof CreateStudioDto>;
export type UpdateStudio = z.infer<typeof UpdateStudioDto>;
export type StudioResponse = z.infer<typeof StudioResponseDto>;
