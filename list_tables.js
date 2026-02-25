const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listTables() {
    try {
        const tables = await prisma.$queryRawUnsafe(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
        `);
        console.log("Tablas encontradas:", tables);
    } catch (error) {
        console.error("Error al listar tablas:", error);
    } finally {
        await prisma.$disconnect();
    }
}

listTables();
