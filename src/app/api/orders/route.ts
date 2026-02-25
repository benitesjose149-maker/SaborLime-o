import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const body = await req.json();
        const { items, total, paymentMethod, paymentPhone, approvalCode, address, phone } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "El pedido está vacío" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email as string },
        });

        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total: total,
                paymentMethod: paymentMethod,
                paymentPhone: paymentPhone,
                approvalCode: approvalCode,
                address: address || user.address,
                phone: phone || user.phone,
                status: "PENDIENTE",
                items: {
                    create: items.map((item: any) => ({
                        dishId: item.id,
                        dishName: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: `Error en el servidor: ${error.message || "Error desconocido"}`, details: error },
            { status: 500 }
        );
    }
}
