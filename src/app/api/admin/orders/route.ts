import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Basic role check - in a real app, use a middleware or more robust check
        if (!session || !session.user || (session.user as any).role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const orders = await prisma.order.findMany({
            where: status ? { status } : {},
            include: {
                items: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        address: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error("Error fetching admin orders:", error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || (session.user as any).role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const body = await req.json();
        const { orderId, status } = body;

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        return NextResponse.json(updatedOrder);
    } catch (error: any) {
        console.error("Error updating order status:", error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}
