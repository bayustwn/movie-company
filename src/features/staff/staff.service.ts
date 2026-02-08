import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createFilterBuilder, addEnumFilter, addSearchFilter, getWhere } from "@/lib/filter-builder";
import { CreateStaffInput, UpdateStaffInput } from "./staff.validator";
import { UserResponse, USER_SELECT, ServiceError } from "@/core";
import type { PaginationDto } from "@/core/dto/pagination.dto";
import type { StaffFilterDto } from "./dto/staff-filter.dto";

export const staffService = {
    async getAll(
        filters: StaffFilterDto,
        pagination: PaginationDto
    ): Promise<{ staff: UserResponse[], pagination: { page: number, limit: number, total: number, totalPages: number } }> {
        const { page, limit, sortBy = "createdAt", sortOrder } = pagination;
        const { role, search } = filters;

        const builder = createFilterBuilder();

        addEnumFilter(builder, "role", role);
        addSearchFilter(builder, ["name", "email"], search);

        const where = getWhere(builder);

        const [staff, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: USER_SELECT,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.user.count({ where }),
        ]);

        return {
            staff,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
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
