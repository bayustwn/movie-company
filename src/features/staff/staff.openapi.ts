import { registry } from "@/lib/swagger";
import { z } from "zod";
import { CreateStaffDto, UpdateStaffDto, StaffResponseDto, StaffFilterDto } from "./dto/staff.dto";
import { ApiResponseDto, ErrorResponseDto, ValidationErrorResponseDto } from "@/core/dto/common.dto";
import { PaginationDto, PaginatedResponseDto } from "@/core/dto/pagination.dto";

registry.register("CreateStaffDto", CreateStaffDto);
registry.register("UpdateStaffDto", UpdateStaffDto);
registry.register("StaffResponse", StaffResponseDto);

registry.registerPath({
    method: "get",
    path: "/staff",
    tags: ["Staff Management"],
    summary: "List all staff",
    description: "Retrieve a paginated list of staff members with filters. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        query: z.object({
            page: PaginationDto.shape.page,
            limit: PaginationDto.shape.limit,
            sortBy: PaginationDto.shape.sortBy,
            sortOrder: PaginationDto.shape.sortOrder,
            role: StaffFilterDto.shape.role,
            search: StaffFilterDto.shape.search,
        }),
    },
    responses: {
        200: {
            description: "Staff list retrieved successfully",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        data: z.object({
                            data: z.array(StaffResponseDto),
                            pagination: z.object({
                                page: z.number(),
                                limit: z.number(),
                                total: z.number(),
                                totalPages: z.number(),
                            }),
                        }),
                    }),
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
    },
});

registry.registerPath({
    method: "post",
    path: "/staff",
    tags: ["Staff Management"],
    summary: "Create new staff",
    description: "Create a new staff member. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateStaffDto,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Staff created successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(StaffResponseDto),
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
        409: {
            description: "Email already exists",
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
    path: "/staff/{id}",
    tags: ["Staff Management"],
    summary: "Get staff by ID",
    description: "Retrieve a specific staff member by ID. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Staff member ID"
            }),
        }),
    },
    responses: {
        200: {
            description: "Staff details retrieved",
            content: {
                "application/json": {
                    schema: ApiResponseDto(StaffResponseDto),
                },
            },
        },
        404: {
            description: "Staff not found",
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
    path: "/staff/{id}",
    tags: ["Staff Management"],
    summary: "Update staff",
    description: "Update staff member information. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Staff member ID"
            }),
        }),
        body: {
            content: {
                "application/json": {
                    schema: UpdateStaffDto,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Staff updated successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(StaffResponseDto),
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
            description: "Staff not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        409: {
            description: "Email already taken",
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
    path: "/staff/{id}",
    tags: ["Staff Management"],
    summary: "Delete staff",
    description: "Delete a staff member. Requires ADMIN role.",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({
                example: "cm5xabc123",
                description: "Staff member ID"
            }),
        }),
    },
    responses: {
        200: {
            description: "Staff deleted successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(z.null()),
                },
            },
        },
        404: {
            description: "Staff not found",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
    },
});
