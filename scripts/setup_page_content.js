require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMssql } = require('@prisma/adapter-mssql');

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaMssql(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log("Creando tabla PageContent...");
        await prisma.$executeRawUnsafe(`
            IF OBJECT_ID('dbo.PageContent', 'U') IS NULL
            BEGIN
                CREATE TABLE [dbo].[PageContent] (
                    [id]        INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
                    [key]       NVARCHAR(255) NOT NULL UNIQUE,
                    [value]     NVARCHAR(MAX) NOT NULL,
                    [updatedAt] DATETIME DEFAULT GETDATE() NOT NULL
                );
            END
        `);
        console.log("Tabla creada exitosamente.");

        console.log("Insertando contenido inicial...");
        const initialContent = {
            'home_hero_title': 'Sabor Limeño',
            'home_hero_subtitle': 'La auténtica experiencia de la comida criolla en el corazón de Lima.',
            'nosotros_history_title': 'Desde el corazón de Lima',
            'nosotros_history_text1': 'Sabor Limeño nació hace más de 15 años como un pequeño sueño familiar en el centro de Lima. Nuestra fundadora, Doña Juana, siempre creyó que la comida criolla no solo alimenta el cuerpo, sino que también reconforta el alma.',
            'nosotros_history_text2': 'Hoy, seguimos manteniendo las mismas recetas secretas, usando los ingredientes más frescos del mercado y dedicando el mismo cariño a cada plato que sale de nuestra cocina.',
            'nosotros_mission': 'Preservar y difundir la auténtica sazón criolla peruana a través de ingredientes de calidad y un servicio que te haga sentir como en casa.',
            'nosotros_vision': 'Ser reconocidos como el restaurante referente de comida casera en Lima, donde la tradición y la modernidad se encuentran en cada mesa.',
            'contacto_address': 'Av. Principal 123, Miraflores, Lima',
            'contacto_phone': '+51 984 256 122',
            'contacto_whatsapp': '+51 984 256 122',
            'contacto_hours': 'Lunes a Domingo: 12:00 PM - 10:00 PM',
            'contacto_email': 'reservas@saborlimeno.com'
        };

        for (const [key, value] of Object.entries(initialContent)) {
            await prisma.$executeRawUnsafe(`
                IF NOT EXISTS (SELECT 1 FROM PageContent WHERE [key] = '${key}')
                BEGIN
                    INSERT INTO PageContent ([key], [value]) VALUES ('${key}', '${value.replace(/'/g, "''")}')
                END
            `);
        }
        console.log("Contenido inicial insertado.");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
