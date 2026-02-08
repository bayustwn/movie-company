import { prisma } from "@/lib/prisma";
import { ServiceError } from "@/core/errors";
import type { CreateTheater, UpdateTheater, TheaterFilter } from "./dto/theater.dto";
import type { Pagination } from "@/core/dto/pagination.dto";
import {
    createFilterBuilder,
    addStringFilter,
    addBooleanFilter,
    getWhere,
} from "@/lib/filter-builder";
import slugify from "slugify";
import { logger } from "@/lib/logger";

function generateSlug(name: string): string {
    return slugify(name, {
        lower: true,
        strict: true,
        locale: "id",
    });
}

export async function createTheater(data: CreateTheater) {
    const slug = generateSlug(data.name);

    logger.info("Creating theater", { message: `Theater: ${data.name}, City: ${data.city}` });

    const existing = await prisma.theater.findUnique({
        where: { slug },
    });

    if (existing) {
        logger.warn("Theater creation failed - duplicate slug", { message: `Slug: ${slug}` });
        throw new ServiceError("Theater with this name already exists", 409);
    }

    const theater = await prisma.theater.create({
        data: {
            ...data,
            slug,
        },
    });

    logger.info("Theater created successfully", {
        message: `ID: ${theater.id}, Name: ${theater.name}`,
    });

    return theater;
}

export async function getTheaters(filters: TheaterFilter, pagination: Pagination) {
    const { page, limit, sortBy = "createdAt", sortOrder = "desc" } = pagination;
    const skip = (page - 1) * limit;

    let builder = createFilterBuilder();

    if (filters.city) {
        builder = addStringFilter(builder, "city", filters.city);
    }

    if (filters.search) {
        builder.where.OR = [
            { name: { contains: filters.search, mode: "insensitive" } },
            { address: { contains: filters.search, mode: "insensitive" } },
        ];
    }

    if (filters.isActive !== undefined) {
        builder = addBooleanFilter(builder, "isActive", filters.isActive);
    }

    const where = getWhere(builder);

    const [theaters, total] = await Promise.all([
        prisma.theater.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                studios: true,
            },
        }),
        prisma.theater.count({ where }),
    ]);

    logger.debug("Theaters fetched", { message: `Count: ${theaters.length}, Total: ${total}` });

    return {
        data: theaters,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getTheaterById(id: string) {
    const theater = await prisma.theater.findUnique({
        where: { id },
        include: {
            studios: true,
        },
    });

    if (!theater) {
        logger.warn("Theater not found", { message: `ID: ${id}` });
        throw new ServiceError("Theater not found", 404);
    }

    return theater;
}

export async function updateTheater(id: string, data: UpdateTheater) {
    logger.info("Updating theater", { message: `ID: ${id}` });

    const theater = await prisma.$transaction(async (tx) => {
        const existing = await tx.theater.findUnique({
            where: { id },
        });

        if (!existing) {
            logger.warn("Theater update failed - not found", { message: `ID: ${id}` });
            throw new ServiceError("Theater not found", 404);
        }

        let slug = existing.slug;
        if (data.name && data.name !== existing.name) {
            slug = generateSlug(data.name);

            const duplicate = await tx.theater.findFirst({
                where: {
                    slug,
                    id: { not: id },
                },
            });

            if (duplicate) {
                logger.warn("Theater update failed - duplicate slug", { message: `Slug: ${slug}` });
                throw new ServiceError("Theater with this name already exists", 409);
            }
        }

        return tx.theater.update({
            where: { id },
            data: {
                ...data,
                slug,
            },
            include: {
                studios: true,
            },
        });
    });

    logger.info("Theater updated successfully", {
        message: `ID: ${theater.id}, Name: ${theater.name}`,
    });

    return theater;
}

export async function deleteTheater(id: string) {
    logger.info("Deleting theater", { message: `ID: ${id}` });

    await prisma.$transaction(async (tx) => {
        const theater = await tx.theater.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { studios: true },
                },
            },
        });

        if (!theater) {
            logger.warn("Theater deletion failed - not found", { message: `ID: ${id}` });
            throw new ServiceError("Theater not found", 404);
        }

        logger.info("Deleting theater with studios", {
            message: `ID: ${id}, Studios count: ${theater._count.studios}`,
        });

        await tx.theater.delete({
            where: { id },
        });
    });

    logger.info("Theater deleted successfully", { message: `ID: ${id}` });
}
