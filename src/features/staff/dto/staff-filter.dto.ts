import { z } from "@/lib/zod-openapi";

export const StaffFilterDto = z.object({
    role: z.enum(["ADMIN", "STAFF"]).optional().openapi({
        example: "STAFF",
        description: "Filter by role"
    }),
    search: z.string().optional().openapi({
        example: "john",
        description: "Search in name and email"
    }),
});

export type StaffFilterDto = z.infer<typeof StaffFilterDto>;
