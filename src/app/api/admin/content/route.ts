import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/admin/content - Obtener todos los textos o por filtro
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const prefix = searchParams.get("prefix");

        const content = await prisma.pageContent.findMany({
            where: prefix ? { key: { startsWith: prefix } } : {}
        });

        const contentMap = content.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        return NextResponse.json(contentMap);
    } catch (error) {
        return NextResponse.json({ error: "Error al cargar contenido" }, { status: 500 });
    }
}

// POST /api/admin/content - Guardar/Actualizar textos
export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session.user.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const data = await req.json(); // { key: value }

        const updates = Object.entries(data).map(([key, value]) => {
            return prisma.pageContent.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            });
        });

        await Promise.all(updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: "Error al guardar contenido" }, { status: 500 });
    }
}
