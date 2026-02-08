import { z } from "zod";
import {
    CreateMovieDto,
    UpdateMovieDto,
    MovieFilterDto,
    GENRES,
    RATINGS
} from "./dto/movie.dto";
import { PaginationDto } from "@/core/dto/pagination.dto";

export const createMovieSchema = CreateMovieDto;
export const updateMovieSchema = UpdateMovieDto;
export const movieFilterSchema = MovieFilterDto;
export const paginationSchema = PaginationDto;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const fileUploadSchema = z.object({
    file: z.custom<File>((file) => {
        if (!(file instanceof File)) return false;
        if (file.size > MAX_FILE_SIZE) return false;
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return false;
        return true;
    }, {
        message: "Invalid file. Must be JPEG, PNG, or WebP and less than 5MB"
    })
});

export { GENRES, RATINGS };
