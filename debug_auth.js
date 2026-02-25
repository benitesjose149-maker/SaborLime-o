const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    try {
        const users = await prisma.user.findMany();
        const accounts = await prisma.account.findMany();
        console.log("Usuarios en DB:", users.length);
        if (users.length > 0) {
            console.log("Emails registrados:", users.map(u => u.email).join(', '));
        }
        console.log("Cuentas (Google/OAuth) en DB:", accounts.length);
    } catch (e) {
        console.error("Error checking DB:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
