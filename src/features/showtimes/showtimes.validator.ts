import { z } from "zod";
import { CreateShowtimeDto, UpdateShowtimeDto, ShowtimeFilterDto } from "./dto/showtime.dto";

export const createShowtimeSchema = CreateShowtimeDto;
export const updateShowtimeSchema = UpdateShowtimeDto;
export const showtimeFilterSchema = ShowtimeFilterDto;

export const showtimeIdSchema = z.object({
    id: z.string().cuid(),
});
