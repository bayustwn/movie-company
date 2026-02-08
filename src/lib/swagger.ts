import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "@/lib/zod-openapi";

export const registry = new OpenAPIRegistry();

export function registerSchema(name: string, schema: any) {
    registry.register(name, schema);
}

export function generateOpenApiDocs() {
    registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT access token",
    });

    const generator = new OpenApiGeneratorV3(registry.definitions);

    return generator.generateDocument({
        openapi: "3.0.0",
        info: {
            title: "Cinema Ticket Booking API",
            version: "1.0.0",
            description: "REST API for cinema ticket booking system",
        },
        servers: [
            {
                url: "/api",
                description: "API Base URL",
            },
        ],
        tags: [
            {
                name: "Authentication",
                description: "User authentication and token management",
            },
            {
                name: "Staff Management",
                description: "Staff CRUD operations (Admin only)",
            },
            {
                name: "Movies",
                description: "Movie management with poster uploads (Admin only)",
            },
        ],
    });
}
