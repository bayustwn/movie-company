import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { CreateStaffInput, UpdateStaffInput } from "./staff.validator";
import { UserResponse, USER_SELECT, ServiceError } from "@/core";

export const staffService = {
    async getAll(): Promise<UserResponse[]> {
        return prisma.user.findMany({
            select: USER_SELECT,
            orderBy: { createdAt: "desc" },
        });
    },

    async getById(id: string): Promise<UserResponse> {
        const user = await prisma.user.findUnique({
            where: { id },
            select: USER_SELECT,
        });

        if (!user) {
            throw new ServiceError("Staff not found", 404);
        }

        return user;
    },

    async create(input: CreateStaffInput): Promise<UserResponse> {
        const { email, password, name, role } = input;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ServiceError("User with this email already exists", 409);
        }

        const hashedPassword = await hashPassword(password);
        return prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || "STAFF",
            },
            select: USER_SELECT,
        });
    },

    async update(id: string, input: UpdateStaffInput): Promise<UserResponse> {
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new ServiceError("Staff not found", 404);
        }

        if (input.email && input.email !== existingUser.email) {
            const emailTaken = await prisma.user.findUnique({
                where: { email: input.email },
            });
            if (emailTaken) {
                throw new ServiceError("Email is already taken", 409);
            }
        }

        const updateData: Record<string, unknown> = {};
        if (input.email) updateData.email = input.email;
        if (input.name) updateData.name = input.name;
        if (input.role) updateData.role = input.role;
        if (input.password) {
            updateData.password = await hashPassword(input.password);
        }

        return prisma.user.update({
            where: { id },
            data: updateData,
            select: USER_SELECT,
        });
    },

    async delete(id: string): Promise<void> {
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new ServiceError("Staff not found", 404);
        }

        await prisma.user.delete({
            where: { id },
        });
    },
};
