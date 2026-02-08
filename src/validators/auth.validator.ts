import { z } from "zod";
import { emailSchema } from "./index";

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
    rememberMe: z.boolean().optional().default(false),
});

export type RefreshInput = z.infer<typeof refreshSchema>;
