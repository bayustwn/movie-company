import { registry } from "@/lib/swagger";
import { z } from "zod";
import { CreateMovieDto, UpdateMovieDto, MovieResponseDto, MovieFilterDto } from "./dto/movie.dto";
import {
    ApiResponseDto,
    ErrorResponseDto,
    ValidationErrorResponseDto,
} from "@/core/dto/common.dto";
import { PaginationDto, PaginatedResponseDto } from "@/core/dto/pagination.dto";

registry.register("CreateMovieDto", CreateMovieDto);
registry.register("UpdateMovieDto", UpdateMovieDto);
registry.register("MovieResponse", MovieResponseDto);

registry.registerPath({
    method: "get",
    path: "/movies",
    tags: ["Movies"],
    summary: "List all movies",
    description:
        "Retrieve a paginated list of movies with advanced filters including date range, duration range, multiple genres, and search.",
    request: {
        query: z.object({
            page: PaginationDto.shape.page,
            limit: PaginationDto.shape.limit,
            sortBy: PaginationDto.shape.sortBy,
            sortOrder: PaginationDto.shape.sortOrder,
            genre: MovieFilterDto.shape.genre,
            genres: MovieFilterDto.shape.genres,
            rating: MovieFilterDto.shape.rating,
            isActive: MovieFilterDto.shape.isActive,
            search: MovieFilterDto.shape.search,
            releaseDateFrom: MovieFilterDto.shape.releaseDateFrom,
            releaseDateTo: MovieFilterDto.shape.releaseDateTo,
            durationMin: MovieFilterDto.shape.durationMin,
            durationMax: MovieFilterDto.shape.durationMax,
        }),
    },
    responses: {
        200: {
            description: "Movies retrieved successfully",
            content: {
                "application/json": {
                    schema: PaginatedResponseDto(MovieResponseDto),
                },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/movies",
    tags: ["Movies"],
    summary: "Create new movie",
    description: "Create a new movie. Requires ADMIN role. Poster can be uploaded separately.",
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateMovieDto,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Movie created successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(MovieResponseDto),
                },
            },
        },
        400: {
            description: "Validation error",
            content: {
                "application/json": {
                    schema: ValidationErrorResponseDto,
                },
            },
        },
        401: {
            description: "Unauthorized",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        403: {
            description: "Forbidden - Requires ADMIN role",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        409: {
            description: "Movie with this title already exists",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/movies/{id}",
    tags: ["Movies"],
    summary: "Get movie by ID",
    description: "Retrieve a specific movie by ID.",
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Movie ID",
            }),
        }),
    },
    responses: {
        200: {
            description: "Movie retrieved successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(MovieResponseDto),
                },
            },
        },
        404: {
            description: "Movie not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
    },
});

registry.registerPath({
    method: "patch",
    path: "/movies/{id}",
    tags: ["Movies"],
    summary: "Update movie",
    description: "Update movie information. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Movie ID",
            }),
        }),
        body: {
            content: {
                "application/json": {
                    schema: UpdateMovieDto,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Movie updated successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(MovieResponseDto),
                },
            },
        },
        400: {
            description: "Validation error",
            content: {
                "application/json": {
                    schema: ValidationErrorResponseDto,
                },
            },
        },
        401: {
            description: "Unauthorized",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        403: {
            description: "Forbidden - Requires ADMIN role",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        404: {
            description: "Movie not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        409: {
            description: "Movie with this title already exists",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
    },
});

registry.registerPath({
    method: "delete",
    path: "/movies/{id}",
    tags: ["Movies"],
    summary: "Delete movie",
    description: "Delete a movie and its poster from Cloudinary. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Movie ID",
            }),
        }),
    },
    responses: {
        200: {
            description: "Movie deleted successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(z.null()),
                },
            },
        },
        401: {
            description: "Unauthorized",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        403: {
            description: "Forbidden - Requires ADMIN role",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        404: {
            description: "Movie not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/movies/{id}/poster",
    tags: ["Movies"],
    summary: "Upload movie poster",
    description:
        "Upload or replace movie poster image. Requires ADMIN role. Max size: 5MB. Accepted formats: JPEG, PNG, WebP.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Movie ID",
            }),
        }),
        body: {
            content: {
                "multipart/form-data": {
                    schema: z.object({
                        poster: z.string().openapi({
                            type: "string",
                            format: "binary",
                            description: "Poster image file (JPEG, PNG, or WebP, max 5MB)",
                        }),
                    }),
                },
            },
        },
    },
    responses: {
        200: {
            description: "Poster uploaded successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(MovieResponseDto),
                },
            },
        },
        400: {
            description: "Invalid file",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        401: {
            description: "Unauthorized",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        403: {
            description: "Forbidden - Requires ADMIN role",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        404: {
            description: "Movie not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
    },
});
