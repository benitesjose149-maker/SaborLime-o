const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function hack() {
    try {
        console.log("Intentando soltar restricciones de llaves foráneas...");
        // Intentar soltar las FKs que bloquean el cambio
        try { await prisma.$executeRawUnsafe(`ALTER TABLE Account DROP CONSTRAINT IF EXISTS Account_userId_fkey`); } catch (e) { }
        try { await prisma.$executeRawUnsafe(`ALTER TABLE Session DROP CONSTRAINT IF EXISTS Session_userId_fkey`); } catch (e) { }

        console.log("Eliminando tablas antiguas...");
        try { await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS Account`); } catch (e) { }
        try { await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS Session`); } catch (e) { }
        try { await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS SaborUsers`); } catch (e) { }

        console.log("Tablas eliminadas. Listo para npx prisma db push");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

hack();
