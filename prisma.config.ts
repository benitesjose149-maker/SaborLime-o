import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "Backend/prisma/schema.prisma",
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
