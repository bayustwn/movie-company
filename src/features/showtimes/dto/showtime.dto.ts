import { z } from "@/lib/zod-openapi";
import { futureDateValidator } from "@/lib/validators/date.validator";

export const CreateShowtimeDto = z
    .object({
        movieId: z.string().cuid().openapi({
            example: "cm5xmov456",
            description: "Movie ID",
        }),
        studioId: z.string().cuid().openapi({
            example: "cm5xstu789",
            description: "Studio ID",
        }),
        startTime: futureDateValidator.openapi({
            example: "2024-01-15T14:00:00Z",
            description: "Showtime start time (must be in future)",
        }),
        price: z.number().int().min(0).optional().openapi({
            example: 50000,
            description: "Ticket price (overrides studio base price if provided)",
        }),
    })
    .openapi("CreateShowtimeDto");

export const UpdateShowtimeDto = CreateShowtimeDto.partial().openapi("UpdateShowtimeDto");

export const ShowtimeResponseDto = z
    .object({
        id: z.string().openapi({ example: "cm5xshow123" }),
        movieId: z.string().openapi({ example: "cm5xmov456" }),
        studioId: z.string().openapi({ example: "cm5xstu789" }),
        startTime: z.date().openapi({ example: "2024-01-15T14:00:00Z" }),
        endTime: z.date().openapi({ example: "2024-01-15T16:15:00Z" }),
        price: z.number().openapi({ example: 50000 }),
        createdAt: z.date().openapi({ example: "2024-01-01T00:00:00Z" }),
        updatedAt: z.date().openapi({ example: "2024-01-01T00:00:00Z" }),
    })
    .openapi("ShowtimeResponseDto");

export const ShowtimeWithDetailsDto = ShowtimeResponseDto.extend({
    movie: z.object({
        id: z.string(),
        title: z.string(),
        duration: z.number(),
        rating: z.string(),
        posterUrl: z.string().nullable(),
    }),
    studio: z.object({
        id: z.string(),
        name: z.string(),
        capacity: z.number(),
        theater: z.object({
            id: z.string(),
            name: z.string(),
            city: z.string(),
        }),
    }),
}).openapi("ShowtimeWithDetailsDto");

export const ShowtimeFilterDto = z
    .object({
        movieId: z.string().cuid().optional().openapi({
            example: "cm5xmov456",
            description: "Filter by movie",
        }),
        studioId: z.string().cuid().optional().openapi({
            example: "cm5xstu789",
            description: "Filter by studio",
        }),
        theaterId: z.string().cuid().optional().openapi({
            example: "cm5xthe123",
            description: "Filter by theater",
        }),
        startDate: z.string().optional().openapi({
            example: "2024-01-15",
            description: "Filter from this date (inclusive)",
        }),
        endDate: z.string().optional().openapi({
            example: "2024-01-20",
            description: "Filter until this date (inclusive)",
        }),
        futureOnly: z
            .string()
            .optional()
            .transform((val) => val === "true")
            .openapi({
                example: "true",
                description: "Show only future showtimes",
            }),
    })
    .openapi("ShowtimeFilterDto");

export type CreateShowtime = z.infer<typeof CreateShowtimeDto>;
export type UpdateShowtime = z.infer<typeof UpdateShowtimeDto>;
export type ShowtimeResponse = z.infer<typeof ShowtimeResponseDto>;
export type ShowtimeWithDetails = z.infer<typeof ShowtimeWithDetailsDto>;
export type ShowtimeFilter = z.infer<typeof ShowtimeFilterDto>;
