import { registry } from "@/lib/swagger";
import { z } from "zod";
import { LoginDto, RefreshTokenDto, AuthResponseDto, TokenPairDto } from "./dto/auth.dto";
import { ApiResponseDto, ErrorResponseDto, ValidationErrorResponseDto } from "@/core/dto/common.dto";

registry.register("LoginDto", LoginDto);
registry.register("RefreshTokenDto", RefreshTokenDto);
registry.register("AuthResponse", AuthResponseDto);
registry.register("TokenPair", TokenPairDto);

registry.registerPath({
    method: "post",
    path: "/auth/login",
    tags: ["Authentication"],
    summary: "User login",
    description: "Authenticate user with email and password. Returns access and refresh tokens.",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: LoginDto,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Login successful",
            content: {
                "application/json": {
                    schema: ApiResponseDto(AuthResponseDto),
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
            description: "Invalid credentials",
            content: {
                "application/json": {
                    schema: ErrorResponseDto,
                },
            },
        },
        429: {
            description: "Too many requests",
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
    path: "/auth/refresh",
    tags: ["Authentication"],
    summary: "Refresh access token",
    description: "Get new access and refresh tokens using a valid refresh token.",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: RefreshTokenDto,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Tokens refreshed successfully",
            content: {
                "application/json": {
                    schema: ApiResponseDto(TokenPairDto),
                },
            },
        },
        401: {
            description: "Invalid or expired refresh token",
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
    path: "/auth/me",
    tags: ["Authentication"],
    summary: "Get current user",
    description: "Retrieve authenticated user information.",
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "User details retrieved",
            content: {
                "application/json": {
                    schema: ApiResponseDto(z.object({
                        user: AuthResponseDto.shape.user,
                    })),
                },
            },
        },
        401: {
            description: "Unauthorized - Invalid or missing token",
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
    path: "/auth/logout",
    tags: ["Authentication"],
    summary: "Logout user",
    description: "Invalidate user's refresh token.",
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "Logout successful",
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
    },
});
