import { formatZodErrors } from "@/features/auth";
import { loginSchema, refreshSchema } from "@/features/auth";
import { createStaffSchema, updateStaffSchema } from "@/features/staff";
import { z } from "zod";

describe("Auth Validators", () => {
    describe("loginSchema", () => {
        it("should validate correct login data", () => {
            const result = loginSchema.safeParse({
                email: "test@example.com",
                password: "password123",
            });
            expect(result.success).toBe(true);
        });

        it("should reject invalid email", () => {
            const result = loginSchema.safeParse({
                email: "invalid-email",
                password: "password123",
            });
            expect(result.success).toBe(false);
        });

        it("should reject empty password", () => {
            const result = loginSchema.safeParse({
                email: "test@example.com",
                password: "",
            });
            expect(result.success).toBe(false);
        });

        it("should default rememberMe to false", () => {
            const result = loginSchema.safeParse({
                email: "test@example.com",
                password: "password123",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.rememberMe).toBe(false);
            }
        });
    });

    describe("refreshSchema", () => {
        it("should validate correct refresh data", () => {
            const result = refreshSchema.safeParse({
                refreshToken: "some-token",
            });
            expect(result.success).toBe(true);
        });

        it("should reject empty refresh token", () => {
            const result = refreshSchema.safeParse({
                refreshToken: "",
            });
            expect(result.success).toBe(false);
        });
    });
});

describe("Staff Validators", () => {
    describe("createStaffSchema", () => {
        it("should validate correct staff data", () => {
            const result = createStaffSchema.safeParse({
                email: "staff@example.com",
                password: "password123",
                name: "John Doe",
            });
            expect(result.success).toBe(true);
        });

        it("should reject short password", () => {
            const result = createStaffSchema.safeParse({
                email: "staff@example.com",
                password: "123",
                name: "John Doe",
            });
            expect(result.success).toBe(false);
        });

        it("should default role to STAFF", () => {
            const result = createStaffSchema.safeParse({
                email: "staff@example.com",
                password: "password123",
                name: "John Doe",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.role).toBe("STAFF");
            }
        });
    });

    describe("updateStaffSchema", () => {
        it("should allow partial updates", () => {
            const result = updateStaffSchema.safeParse({
                name: "Updated Name",
            });
            expect(result.success).toBe(true);
        });

        it("should reject invalid role", () => {
            const result = updateStaffSchema.safeParse({
                role: "INVALID",
            });
            expect(result.success).toBe(false);
        });
    });
});

describe("formatZodErrors", () => {
    it("should format Zod errors correctly", () => {
        const schema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });

        const result = schema.safeParse({
            email: "invalid",
            password: "123",
        });

        if (!result.success) {
            const errors = formatZodErrors(result.error);
            expect(errors).toHaveProperty("email");
            expect(errors).toHaveProperty("password");
        }
    });
});
