import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "src/app/api",
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Cinema Ticket API",
                version: "1.0.0",
                description: "API documentation for Cinema Ticket Booking System",
            },
            servers: [
                {
                    url: "http://localhost:3000",
                    description: "Development server",
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
                schemas: {
                    User: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            email: { type: "string", format: "email" },
                            name: { type: "string" },
                            role: { type: "string", enum: ["ADMIN", "STAFF"] },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                    },
                    LoginRequest: {
                        type: "object",
                        required: ["email", "password"],
                        properties: {
                            email: { type: "string", format: "email", example: "admin@cinema.com" },
                            password: { type: "string", example: "admin123" },
                            rememberMe: { type: "boolean", default: false },
                        },
                    },
                    LoginResponse: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                            user: { $ref: "#/components/schemas/User" },
                            accessToken: { type: "string" },
                            refreshToken: { type: "string" },
                        },
                    },
                    RegisterRequest: {
                        type: "object",
                        required: ["email", "password", "name"],
                        properties: {
                            email: { type: "string", format: "email" },
                            password: { type: "string", minLength: 6 },
                            name: { type: "string" },
                            role: { type: "string", enum: ["ADMIN", "STAFF"] },
                        },
                    },
                    RefreshRequest: {
                        type: "object",
                        required: ["refreshToken"],
                        properties: {
                            refreshToken: { type: "string" },
                            rememberMe: { type: "boolean", default: false },
                        },
                    },
                    TokenResponse: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                            accessToken: { type: "string" },
                            refreshToken: { type: "string" },
                        },
                    },
                    Error: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                        },
                    },
                },
            },
            tags: [
                { name: "Auth", description: "Authentication endpoints" },
            ],
        },
    });
    return spec;
};
