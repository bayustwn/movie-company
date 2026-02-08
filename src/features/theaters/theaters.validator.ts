import { z } from "zod";
import { CreateTheaterDto, UpdateTheaterDto, TheaterFilterDto } from "./dto/theater.dto";
import { CreateStudioDto, UpdateStudioDto } from "./dto/studio.dto";

export const createTheaterSchema = CreateTheaterDto;
export const updateTheaterSchema = UpdateTheaterDto;
export const theaterFilterSchema = TheaterFilterDto;

export const createStudioSchema = CreateStudioDto;
export const updateStudioSchema = UpdateStudioDto;

export const theaterIdSchema = z.object({
    id: z.string().cuid(),
});

export const studioIdSchema = z.object({
    studioId: z.string().cuid(),
});
