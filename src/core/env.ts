import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
    JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),

    JWT_ACCESS_EXPIRY: z.string().optional().default("2h"),
    JWT_ACCESS_EXPIRY_REMEMBER: z.string().optional().default("30d"),
    JWT_REFRESH_EXPIRY: z.string().optional().default("7d"),
    JWT_REFRESH_EXPIRY_REMEMBER: z.string().optional().default("30d"),
    BCRYPT_SALT_ROUNDS: z.string().optional().default("12"),
    BCRYPT_TOKEN_SALT_ROUNDS: z.string().optional().default("10"),

    CORS_ORIGINS: z.string().optional().default("*"),
    NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error("❌ Invalid environment variables:");
        result.error.issues.forEach((issue) => {
            console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
        });
        throw new Error("Environment validation failed");
    }

    return result.data;
}

export const env = validateEnv();
