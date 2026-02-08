import { prisma } from "@/lib/prisma";
import { successResponse, serverErrorResponse } from "@/core";

export async function GET() {
    const startTime = Date.now();

    try {
        await prisma.$queryRaw`SELECT 1`;

        return successResponse({
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: "connected",
            responseTime: Date.now() - startTime,
        });
    } catch (error) {
        return serverErrorResponse(error as Error);
    }
}
