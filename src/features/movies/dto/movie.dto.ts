import { z } from "@/lib/zod-openapi";

const GENRES = [
    "Action", "Adventure", "Animation", "Comedy", "Crime",
    "Documentary", "Drama", "Fantasy", "Horror", "Mystery",
    "Romance", "Sci-Fi", "Thriller", "War", "Western"
] as const;

const RATINGS = ["G", "PG", "PG-13", "R", "NC-17"] as const;

export const CreateMovieDto = z.object({
    title: z.string().min(1).max(255).openapi({
        example: "The Matrix",
        description: "Movie title"
    }),
    description: z.string().min(1).openapi({
        example: "A computer hacker learns about the true nature of reality.",
        description: "Movie description"
    }),
    genre: z.array(z.enum(GENRES)).min(1).openapi({
        example: ["Action", "Sci-Fi"],
        description: "Movie genres"
    }),
    duration: z.number().int().positive().openapi({
        example: 136,
        description: "Duration in minutes"
    }),
    rating: z.enum(RATINGS).openapi({
        example: "R",
        description: "Age rating"
    }),
    releaseDate: z.coerce.date().openapi({
        example: "1999-03-31",
        description: "Release date"
    }),
}).openapi("CreateMovieDto");

export type CreateMovieDto = z.infer<typeof CreateMovieDto>;

export const UpdateMovieDto = z.object({
    title: z.string().min(1).max(255).optional().openapi({
        example: "The Matrix Reloaded"
    }),
    description: z.string().min(1).optional().openapi({
        example: "Neo and the rebel leaders estimate they have 72 hours."
    }),
    genre: z.array(z.enum(GENRES)).min(1).optional().openapi({
        example: ["Action", "Sci-Fi"]
    }),
    duration: z.number().int().positive().optional().openapi({
        example: 138
    }),
    rating: z.enum(RATINGS).optional().openapi({
        example: "R"
    }),
    releaseDate: z.coerce.date().optional().openapi({
        example: "2003-05-15"
    }),
    isActive: z.boolean().optional().openapi({
        example: true,
        description: "Whether movie is active"
    }),
}).openapi("UpdateMovieDto");

export type UpdateMovieDto = z.infer<typeof UpdateMovieDto>;

export const MovieResponseDto = z.object({
    id: z.string().openapi({ example: "cm5xabc123" }),
    title: z.string().openapi({ example: "The Matrix" }),
    description: z.string().openapi({ example: "A computer hacker learns about the true nature of reality." }),
    genre: z.array(z.string()).openapi({ example: ["Action", "Sci-Fi"] }),
    duration: z.number().openapi({ example: 136 }),
    rating: z.string().openapi({ example: "R" }),
    releaseDate: z.date().openapi({ example: "1999-03-31T00:00:00Z" }),
    posterUrl: z.string().nullable().openapi({ example: "https://res.cloudinary.com/..." }),
    isActive: z.boolean().openapi({ example: true }),
    createdAt: z.date().openapi({ example: "2024-01-01T00:00:00Z" }),
    updatedAt: z.date().openapi({ example: "2024-01-01T00:00:00Z" }),
}).openapi("MovieResponse");

export type MovieResponseDto = z.infer<typeof MovieResponseDto>;

export const MovieFilterDto = z.object({
    genre: z.string().optional().openapi({
        example: "Action",
        description: "Filter by genre"
    }),
    rating: z.enum(RATINGS).optional().openapi({
        example: "PG-13",
        description: "Filter by rating"
    }),
    isActive: z.coerce.boolean().optional().openapi({
        example: true,
        description: "Filter by active status"
    }),
    search: z.string().optional().openapi({
        example: "Matrix",
        description: "Search in title and description"
    }),
});

export type MovieFilterDto = z.infer<typeof MovieFilterDto>;

export { GENRES, RATINGS };
