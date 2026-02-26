import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Función para verificar si es administrador
async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "ADMIN";
}

export async function POST(req: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { name, description, price, category, image } = body;

        const newDish = await prisma.dish.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                image,
                available: true
            }
        });

        return NextResponse.json(newDish);
    } catch (error) {
        console.error("Error creating dish:", error);
        return NextResponse.json({ error: "Error al crear el plato" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { id, name, description, price, category, image, available } = body;

        const updatedDish = await prisma.dish.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                image,
                available
            }
        });

        return NextResponse.json(updatedDish);
    } catch (error) {
        console.error("Error updating dish:", error);
        return NextResponse.json({ error: "Error al actualizar el plato" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

        await prisma.dish.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: "Plato eliminado correctamente" });
    } catch (error) {
        console.error("Error deleting dish:", error);
        return NextResponse.json({ error: "Error al eliminar el plato" }, { status: 500 });
    }
}
