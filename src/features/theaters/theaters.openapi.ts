import { registry } from "@/lib/swagger";
import { z } from "zod";
import {
    CreateTheaterDto,
    UpdateTheaterDto,
    TheaterResponseDto,
    TheaterFilterDto,
} from "./dto/theater.dto";
import { CreateStudioDto, UpdateStudioDto, StudioResponseDto } from "./dto/studio.dto";
import {
    ApiResponseDto,
    ErrorResponseDto,
    ValidationErrorResponseDto,
} from "@/core/dto/common.dto";
import { PaginationDto, PaginatedResponseDto } from "@/core/dto/pagination.dto";

registry.register("CreateTheaterDto", CreateTheaterDto);
registry.register("UpdateTheaterDto", UpdateTheaterDto);
registry.register("TheaterResponse", TheaterResponseDto);
registry.register("CreateStudioDto", CreateStudioDto);
registry.register("UpdateStudioDto", UpdateStudioDto);
registry.register("StudioResponse", StudioResponseDto);

registry.registerPath({
    method: "get",
    path: "/theaters",
    tags: ["Theaters"],
    summary: "List all theaters",
    description: "Retrieve a paginated list of theaters with filters.",
    request: {
        query: z.object({
            page: PaginationDto.shape.page,
            limit: PaginationDto.shape.limit,
            sortBy: PaginationDto.shape.sortBy,
            sortOrder: PaginationDto.shape.sortOrder,
            city: TheaterFilterDto.shape.city,
            search: TheaterFilterDto.shape.search,
            isActive: TheaterFilterDto.shape.isActive,
        }),
    },
    responses: {
        200: {
            description: "Theaters retrieved successfully",
            content: {
                "application/json": {
                    schema: PaginatedResponseDto(TheaterResponseDto),
                },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/theaters",
    tags: ["Theaters"],
    summary: "Create new theater",
    description: "Create a new theater. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateTheaterDto,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Theater created successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(TheaterResponseDto),
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
            description: "Theater with this name already exists",
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
    path: "/theaters/{id}",
    tags: ["Theaters"],
    summary: "Get theater by ID",
    description: "Retrieve a specific theater with its studios.",
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Theater ID",
            }),
        }),
    },
    responses: {
        200: {
            description: "Theater retrieved successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(TheaterResponseDto),
                },
            },
        },
        404: {
            description: "Theater not found",
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
    path: "/theaters/{id}",
    tags: ["Theaters"],
    summary: "Update theater",
    description: "Update theater information. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Theater ID",
            }),
        }),
        body: {
            content: {
                "application/json": {
                    schema: UpdateTheaterDto,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Theater updated successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(TheaterResponseDto),
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
            description: "Theater not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        409: {
            description: "Theater with this name already exists",
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
    path: "/theaters/{id}",
    tags: ["Theaters"],
    summary: "Delete theater",
    description: "Delete a theater and all its studios. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Theater ID",
            }),
        }),
    },
    responses: {
        200: {
            description: "Theater deleted successfully",
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
            description: "Theater not found",
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
    path: "/theaters/{id}/studios",
    tags: ["Studios"],
    summary: "List theater studios",
    description: "Retrieve all studios in a theater.",
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Theater ID",
            }),
        }),
    },
    responses: {
        200: {
            description: "Studios retrieved successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(z.array(StudioResponseDto)),
                },
            },
        },
        404: {
            description: "Theater not found",
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
    path: "/theaters/{id}/studios",
    tags: ["Studios"],
    summary: "Create studio",
    description: "Create a new studio in a theater. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Theater ID",
            }),
        }),
        body: {
            content: {
                "application/json": {
                    schema: CreateStudioDto,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Studio created successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(StudioResponseDto),
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
            description: "Theater not found",
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
    path: "/theaters/{id}/studios/{studioId}",
    tags: ["Studios"],
    summary: "Update studio",
    description: "Update studio information. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Theater ID",
            }),
            studioId: z.string().openapi({
                example: "cm5xdef456",
                description: "Studio ID",
            }),
        }),
        body: {
            content: {
                "application/json": {
                    schema: UpdateStudioDto,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Studio updated successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(StudioResponseDto),
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
            description: "Studio not found",
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
    path: "/theaters/{id}/studios/{studioId}",
    tags: ["Studios"],
    summary: "Delete studio",
    description: "Delete a studio. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Theater ID",
            }),
            studioId: z.string().openapi({
                example: "cm5xdef456",
                description: "Studio ID",
            }),
        }),
    },
    responses: {
        200: {
            description: "Studio deleted successfully",
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
            description: "Studio not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
    },
});
