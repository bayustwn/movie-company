import { z } from "@/lib/zod-openapi";
import { UserDto } from "@/core/dto/common.dto";
export * from "./staff-filter.dto";

export const CreateStaffDto = z.object({
    email: z.string().email().openapi({
        example: "staff@cinema.com",
        description: "Staff email address (must be unique)"
    }),
    password: z.string().min(6).openapi({
        example: "staff123",
        description: "Staff password (minimum 6 characters)"
    }),
    name: z.string().min(1).openapi({
        example: "John Doe",
        description: "Staff full name"
    }),
    role: z.enum(["ADMIN", "STAFF"]).optional().default("STAFF").openapi({
        example: "STAFF",
        description: "Staff role (ADMIN or STAFF)"
    }),
}).openapi("CreateStaffDto");

export type CreateStaffDto = z.infer<typeof CreateStaffDto>;

export const UpdateStaffDto = z.object({
    email: z.string().email().optional().openapi({
        example: "newemail@cinema.com",
        description: "New email address"
    }),
    password: z.string().min(6).optional().openapi({
        example: "newpassword123",
        description: "New password (minimum 6 characters)"
    }),
    name: z.string().min(1).optional().openapi({
        example: "Jane Doe",
        description: "New full name"
    }),
    role: z.enum(["ADMIN", "STAFF"]).optional().openapi({
        example: "ADMIN",
        description: "New role"
    }),
}).openapi("UpdateStaffDto");

export type UpdateStaffDto = z.infer<typeof UpdateStaffDto>;

export const StaffResponseDto = UserDto.openapi("StaffResponse");

export type StaffResponseDto = z.infer<typeof StaffResponseDto>;
