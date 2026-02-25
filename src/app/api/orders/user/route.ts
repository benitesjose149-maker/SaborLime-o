import { NextResponse } from "next/server";
// Types updated via prisma generate
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email as string },
        });

        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Error al obtener el historial", details: error.message },
            { status: 500 }
        );
    }
}
