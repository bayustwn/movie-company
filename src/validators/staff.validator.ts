import { z } from "zod";
import { emailSchema, passwordSchema, nameSchema, roleSchema } from "./index";

export const createStaffSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    role: roleSchema.optional().default("STAFF"),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export const updateStaffSchema = z.object({
    email: z.string().email("Invalid email format").optional(),
    password: passwordSchema.optional(),
    name: nameSchema.optional(),
    role: roleSchema.optional(),
});

export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
