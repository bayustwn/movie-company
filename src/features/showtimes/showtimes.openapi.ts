import { registry } from "@/lib/swagger";
import { z } from "zod";
import {
    CreateShowtimeDto,
    UpdateShowtimeDto,
    ShowtimeResponseDto,
    ShowtimeWithDetailsDto,
    ShowtimeFilterDto,
} from "./dto/showtime.dto";
import {
    ApiResponseDto,
    ErrorResponseDto,
    ValidationErrorResponseDto,
} from "@/core/dto/common.dto";
import { PaginationDto, PaginatedResponseDto } from "@/core/dto/pagination.dto";

registry.register("CreateShowtimeDto", CreateShowtimeDto);
registry.register("UpdateShowtimeDto", UpdateShowtimeDto);
registry.register("ShowtimeResponse", ShowtimeResponseDto);
registry.register("ShowtimeWithDetails", ShowtimeWithDetailsDto);

registry.registerPath({
    method: "get",
    path: "/showtimes",
    tags: ["Showtimes"],
    summary: "List all showtimes",
    description: "Retrieve a paginated list of showtimes with filters.",
    request: {
        query: z.object({
            page: PaginationDto.shape.page,
            limit: PaginationDto.shape.limit,
            sortBy: PaginationDto.shape.sortBy,
            sortOrder: PaginationDto.shape.sortOrder,
            movieId: ShowtimeFilterDto.shape.movieId,
            studioId: ShowtimeFilterDto.shape.studioId,
            theaterId: ShowtimeFilterDto.shape.theaterId,
            startDate: ShowtimeFilterDto.shape.startDate,
            endDate: ShowtimeFilterDto.shape.endDate,
            futureOnly: ShowtimeFilterDto.shape.futureOnly,
        }),
    },
    responses: {
        200: {
            description: "Showtimes retrieved successfully",
            content: {
                "application/json": {
                    schema: PaginatedResponseDto(ShowtimeWithDetailsDto),
                },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/showtimes",
    tags: ["Showtimes"],
    summary: "Create new showtime",
    description:
        "Create a new showtime. Requires ADMIN role. Auto-calculates end time based on movie duration + 15min buffer.",
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateShowtimeDto,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Showtime created successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(ShowtimeWithDetailsDto),
                },
            },
        },
        400: {
            description: "Validation error or movie not active",
            content: {
                "application/json": {
                    schema: ValidationErrorResponseDto,
                },
            },
        },
        404: {
            description: "Movie or studio not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        409: {
            description: "Studio not available (time conflict)",
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
    path: "/showtimes/{id}",
    tags: ["Showtimes"],
    summary: "Get showtime by ID",
    description: "Retrieve a specific showtime with movie and studio details.",
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xshow123",
                description: "Showtime ID",
            }),
        }),
    },
    responses: {
        200: {
            description: "Showtime retrieved successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(ShowtimeWithDetailsDto),
                },
            },
        },
        404: {
            description: "Showtime not found",
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
    path: "/showtimes/{id}",
    tags: ["Showtimes"],
    summary: "Update showtime",
    description:
        "Update showtime information. Requires ADMIN role. Re-checks conflicts if time or studio changes.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xshow123",
                description: "Showtime ID",
            }),
        }),
        body: {
            content: {
                "application/json": {
                    schema: UpdateShowtimeDto,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Showtime updated successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(ShowtimeWithDetailsDto),
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
        404: {
            description: "Showtime not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        409: {
            description: "Studio not available (time conflict)",
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
    path: "/showtimes/{id}",
    tags: ["Showtimes"],
    summary: "Delete showtime",
    description: "Delete a showtime. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xshow123",
                description: "Showtime ID",
            }),
        }),
    },
    responses: {
        200: {
            description: "Showtime deleted successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(z.null()),
                },
            },
        },
        404: {
            description: "Showtime not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
    },
});
