import { prisma } from "@/lib/prisma";
import { ServiceError } from "@/core/errors";
import type { CreateStudio, UpdateStudio } from "./dto/studio.dto";

export async function createStudio(theaterId: string, data: CreateStudio) {
    const theater = await prisma.theater.findUnique({
        where: { id: theaterId },
    });

    if (!theater) {
        throw new ServiceError("Theater not found", 404);
    }

    return prisma.studio.create({
        data: {
            ...data,
            theaterId,
        },
    });
}

export async function getStudiosByTheater(theaterId: string) {
    const theater = await prisma.theater.findUnique({
        where: { id: theaterId },
    });

    if (!theater) {
        throw new ServiceError("Theater not found", 404);
    }

    return prisma.studio.findMany({
        where: { theaterId },
        orderBy: { name: "asc" },
    });
}

export async function getStudioById(theaterId: string, studioId: string) {
    const studio = await prisma.studio.findFirst({
        where: {
            id: studioId,
            theaterId,
        },
    });

    if (!studio) {
        throw new ServiceError("Studio not found", 404);
    }

    return studio;
}

export async function updateStudio(theaterId: string, studioId: string, data: UpdateStudio) {
    const studio = await prisma.studio.findFirst({
        where: {
            id: studioId,
            theaterId,
        },
    });

    if (!studio) {
        throw new ServiceError("Studio not found", 404);
    }

    return prisma.studio.update({
        where: { id: studioId },
        data,
    });
}

export async function deleteStudio(theaterId: string, studioId: string) {
    const studio = await prisma.studio.findFirst({
        where: {
            id: studioId,
            theaterId,
        },
    });

    if (!studio) {
        throw new ServiceError("Studio not found", 404);
    }

    await prisma.studio.delete({
        where: { id: studioId },
    });
}
