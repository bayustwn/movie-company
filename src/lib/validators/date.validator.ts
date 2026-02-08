import { z } from "zod";
import { isBefore, parseISO, isValid } from "date-fns";

export const futureDateValidator = z
    .string()
    .refine((val) => {
        const date = parseISO(val);
        return isValid(date);
    }, "Invalid date format")
    .refine((val) => {
        const date = parseISO(val);
        return !isBefore(date, new Date());
    }, "Date must be in the future");

export const dateStringValidator = z.string().refine((val) => {
    const date = parseISO(val);
    return isValid(date);
}, "Invalid date format");
