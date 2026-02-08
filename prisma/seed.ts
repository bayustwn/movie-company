import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@cinema.com" },
        update: {},
        create: {
            email: "admin@cinema.com",
            password: adminPassword,
            name: "Admin Cinema",
            role: "ADMIN",
        },
    });
    console.log("✅ Created admin user:", admin.email);

    // Create staff user
    const staffPassword = await bcrypt.hash("staff123", 12);
    const staff = await prisma.user.upsert({
        where: { email: "staff@cinema.com" },
        update: {},
        create: {
            email: "staff@cinema.com",
            password: staffPassword,
            name: "Staff Cinema",
            role: "STAFF",
        },
    });
    console.log("✅ Created staff user:", staff.email);

    console.log("🎉 Seeding completed!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
