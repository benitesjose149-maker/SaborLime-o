const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
    console.log("Iniciando limpieza de base de datos...");
    try {
        // Deshabilitar constraints temporalmente si fuera necesario o simplemente dropear en orden
        // MSSQL requiere dropear las FKs primero o usar DROP TABLE con precaución

        console.log("Eliminando tablas antiguas...");

        // Intentar eliminar las tablas que dependen de User primero
        try { await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS Account`); } catch (e) { }
        try { await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS Session`); } catch (e) { }
        try { await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS SaborUsers`); } catch (e) { }
        try { await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS Clients`); } catch (e) { }

        console.log("Limpieza completada.");
    } catch (error) {
        console.error("Error durante la limpieza:", error);
    } finally {
        await prisma.$disconnect();
    }
}

clean();
