import { prisma } from "@/lib/prisma";
import { ServiceError } from "@/core/errors";
import type { CreateShowtime, UpdateShowtime, ShowtimeFilter } from "./dto/showtime.dto";
import type { Pagination } from "@/core/dto/pagination.dto";
import { createFilterBuilder, addStringFilter, getWhere } from "@/lib/filter-builder";
import { addMinutes, parseISO, startOfDay, endOfDay } from "date-fns";
import { logger } from "@/lib/logger";

const BUFFER_TIME_MINUTES = 15;

async function checkStudioAvailability(
    studioId: string,
    startTime: Date,
    endTime: Date,
    excludeShowtimeId?: string
) {
    const conflict = await prisma.showtime.findFirst({
        where: {
            studioId,
            id: excludeShowtimeId ? { not: excludeShowtimeId } : undefined,
            OR: [
                {
                    AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
                },
                {
                    AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
                },
                {
                    AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
                },
            ],
        },
        include: {
            movie: { select: { title: true } },
        },
    });

    if (conflict) {
        throw new ServiceError(
            `Studio is not available. Conflict with "${conflict.movie.title}" (${conflict.startTime.toISOString()} - ${conflict.endTime.toISOString()})`,
            409
        );
    }
}

export async function createShowtime(data: CreateShowtime) {
    const startTime = parseISO(data.startTime);

    logger.info("Creating showtime", {
        message: `Movie: ${data.movieId}, Studio: ${data.studioId}, Start: ${data.startTime}`,
    });

    return await prisma.$transaction(async (tx) => {
        const [movie, studio] = await Promise.all([
            tx.movie.findUnique({ where: { id: data.movieId } }),
            tx.studio.findUnique({ where: { id: data.studioId } }),
        ]);

        if (!movie) {
            logger.warn("Showtime creation failed - movie not found", {
                message: `Movie ID: ${data.movieId}`,
            });
            throw new ServiceError("Movie not found", 404);
        }

        if (!movie.isActive) {
            logger.warn("Showtime creation failed - movie not active", {
                message: `Movie: ${movie.title}`,
            });
            throw new ServiceError("Movie is not active", 400);
        }

        if (!studio) {
            logger.warn("Showtime creation failed - studio not found", {
                message: `Studio ID: ${data.studioId}`,
            });
            throw new ServiceError("Studio not found", 404);
        }

        const endTime = addMinutes(startTime, movie.duration + BUFFER_TIME_MINUTES);

        await checkStudioAvailability(data.studioId, startTime, endTime);

        const showtime = await tx.showtime.create({
            data: {
                movieId: data.movieId,
                studioId: data.studioId,
                startTime,
                endTime,
                price: data.price ?? studio.price,
            },
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        duration: true,
                        rating: true,
                        posterUrl: true,
                    },
                },
                studio: {
                    select: {
                        id: true,
                        name: true,
                        capacity: true,
                        theater: {
                            select: {
                                id: true,
                                name: true,
                                city: true,
                            },
                        },
                    },
                },
            },
        });

        logger.info("Showtime created successfully", {
            message: `ID: ${showtime.id}, Movie: ${showtime.movie.title}, Start: ${showtime.startTime.toISOString()}`,
        });

        return showtime;
    });
}

export async function getShowtimes(filters: ShowtimeFilter, pagination: Pagination) {
    const { page, limit, sortBy = "startTime", sortOrder = "asc" } = pagination;
    const skip = (page - 1) * limit;

    let builder = createFilterBuilder();

    if (filters.movieId) {
        builder = addStringFilter(builder, "movieId", filters.movieId);
    }

    if (filters.studioId) {
        builder = addStringFilter(builder, "studioId", filters.studioId);
    }

    if (filters.theaterId) {
        builder.where.studio = {
            theaterId: filters.theaterId,
        };
    }

    if (filters.startDate) {
        const start = startOfDay(parseISO(filters.startDate));
        builder.where.startTime = { ...builder.where.startTime, gte: start };
    }

    if (filters.endDate) {
        const end = endOfDay(parseISO(filters.endDate));
        builder.where.startTime = { ...builder.where.startTime, lte: end };
    }

    if (filters.futureOnly) {
        builder.where.startTime = { ...builder.where.startTime, gte: new Date() };
    }

    const where = getWhere(builder);

    const [showtimes, total] = await Promise.all([
        prisma.showtime.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        duration: true,
                        rating: true,
                        posterUrl: true,
                    },
                },
                studio: {
                    select: {
                        id: true,
                        name: true,
                        capacity: true,
                        theater: {
                            select: {
                                id: true,
                                name: true,
                                city: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.showtime.count({ where }),
    ]);

    logger.debug("Showtimes fetched", {
        message: `Count: ${showtimes.length}, Total: ${total}`,
    });

    return {
        data: showtimes,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getShowtimeById(id: string) {
    const showtime = await prisma.showtime.findUnique({
        where: { id },
        include: {
            movie: {
                select: {
                    id: true,
                    title: true,
                    duration: true,
                    rating: true,
                    posterUrl: true,
                },
            },
            studio: {
                select: {
                    id: true,
                    name: true,
                    capacity: true,
                    theater: {
                        select: {
                            id: true,
                            name: true,
                            city: true,
                        },
                    },
                },
            },
        },
    });

    if (!showtime) {
        logger.warn("Showtime not found", { message: `ID: ${id}` });
        throw new ServiceError("Showtime not found", 404);
    }

    return showtime;
}

export async function updateShowtime(id: string, data: UpdateShowtime) {
    logger.info("Updating showtime", { message: `ID: ${id}` });

    return await prisma.$transaction(async (tx) => {
        const existing = await tx.showtime.findUnique({
            where: { id },
            include: { movie: true },
        });

        if (!existing) {
            logger.warn("Showtime update failed - not found", { message: `ID: ${id}` });
            throw new ServiceError("Showtime not found", 404);
        }

        let startTime = existing.startTime;
        let endTime = existing.endTime;
        let movieDuration = existing.movie.duration;

        if (data.startTime) {
            startTime = parseISO(data.startTime);
        }

        if (data.movieId && data.movieId !== existing.movieId) {
            const movie = await tx.movie.findUnique({ where: { id: data.movieId } });
            if (!movie) {
                throw new ServiceError("Movie not found", 404);
            }
            if (!movie.isActive) {
                throw new ServiceError("Movie is not active", 400);
            }
            movieDuration = movie.duration;
        }

        if (data.startTime || data.movieId) {
            endTime = addMinutes(startTime, movieDuration + BUFFER_TIME_MINUTES);
        }

        if (data.studioId || data.startTime || data.movieId) {
            const studioId = data.studioId ?? existing.studioId;
            await checkStudioAvailability(studioId, startTime, endTime, id);
        }

        if (data.studioId) {
            const studio = await tx.studio.findUnique({ where: { id: data.studioId } });
            if (!studio) {
                throw new ServiceError("Studio not found", 404);
            }
        }

        const showtime = await tx.showtime.update({
            where: { id },
            data: {
                ...data,
                startTime: data.startTime ? startTime : undefined,
                endTime: data.startTime || data.movieId ? endTime : undefined,
            },
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        duration: true,
                        rating: true,
                        posterUrl: true,
                    },
                },
                studio: {
                    select: {
                        id: true,
                        name: true,
                        capacity: true,
                        theater: {
                            select: {
                                id: true,
                                name: true,
                                city: true,
                            },
                        },
                    },
                },
            },
        });

        logger.info("Showtime updated successfully", {
            message: `ID: ${showtime.id}, Start: ${showtime.startTime.toISOString()}`,
        });

        return showtime;
    });
}

export async function deleteShowtime(id: string) {
    logger.info("Deleting showtime", { message: `ID: ${id}` });

    await prisma.$transaction(async (tx) => {
        const showtime = await tx.showtime.findUnique({
            where: { id },
            include: {
                movie: { select: { title: true } },
            },
        });

        if (!showtime) {
            logger.warn("Showtime deletion failed - not found", { message: `ID: ${id}` });
            throw new ServiceError("Showtime not found", 404);
        }

        logger.info("Deleting showtime", {
            message: `ID: ${id}, Movie: ${showtime.movie.title}, Start: ${showtime.startTime.toISOString()}`,
        });

        await tx.showtime.delete({ where: { id } });
    });

    logger.info("Showtime deleted successfully", { message: `ID: ${id}` });
}
