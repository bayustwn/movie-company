import { prisma } from "@/lib/prisma";
import { ServiceError } from "@/core/errors";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import type { CreateMovieDto, UpdateMovieDto, MovieFilterDto } from "./dto/movie.dto";
import type { PaginationDto } from "@/core/dto/pagination.dto";

export async function createMovie(data: CreateMovieDto) {
    const existing = await prisma.movie.findFirst({
        where: { title: data.title }
    });

    if (existing) {
        throw new ServiceError("Movie with this title already exists", 409);
    }

    return await prisma.movie.create({
        data: {
            ...data,
            genre: data.genre,
        }
    });
}

export async function getMovies(
    filters: MovieFilterDto,
    pagination: PaginationDto
) {
    const { page, limit, sortBy = "createdAt", sortOrder } = pagination;
    const { genre, rating, isActive, search } = filters;

    const where: any = {};

    if (genre) {
        where.genre = { has: genre };
    }

    if (rating) {
        where.rating = rating;
    }

    if (isActive !== undefined) {
        where.isActive = isActive;
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    const [movies, total] = await Promise.all([
        prisma.movie.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma.movie.count({ where }),
    ]);

    return {
        movies,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getMovieById(id: string) {
    const movie = await prisma.movie.findUnique({
        where: { id }
    });

    if (!movie) {
        throw new ServiceError("Movie not found", 404);
    }

    return movie;
}

export async function updateMovie(id: string, data: UpdateMovieDto) {
    const movie = await getMovieById(id);

    if (data.title && data.title !== movie.title) {
        const existing = await prisma.movie.findFirst({
            where: { title: data.title, id: { not: id } }
        });

        if (existing) {
            throw new ServiceError("Movie with this title already exists", 409);
        }
    }

    return await prisma.movie.update({
        where: { id },
        data: {
            ...data,
            genre: data.genre,
        }
    });
}

export async function deleteMovie(id: string) {
    const movie = await getMovieById(id);

    if (movie.posterPublicId) {
        await deleteImage(movie.posterPublicId);
    }

    await prisma.movie.delete({
        where: { id }
    });
}

export async function uploadMoviePoster(id: string, fileBuffer: Buffer) {
    const movie = await getMovieById(id);

    if (movie.posterPublicId) {
        await deleteImage(movie.posterPublicId);
    }

    const { url, publicId } = await uploadImage(fileBuffer, "movie-posters");

    return await prisma.movie.update({
        where: { id },
        data: {
            posterUrl: url,
            posterPublicId: publicId,
        }
    });
}
