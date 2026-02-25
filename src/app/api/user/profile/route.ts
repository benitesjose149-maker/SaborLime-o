import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email requerido" }, { status: 400 });
        }

        const user = await (prisma as any).user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                apellido: true,
                email: true,
                phone: true,
                address: true,
                image: true,
                createdAt: true,
                provider: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("GET_PROFILE_ERROR:", error);
        return NextResponse.json({ error: error.message || "Error interno al obtener perfil" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { email, name, apellido, phone, address } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email requerido" }, { status: 400 });
        }

        const updatedUser = await (prisma as any).user.update({
            where: { email },
            data: {
                name,
                apellido,
                phone,
                address
            }
        });

        return NextResponse.json({
            message: "Perfil actualizado correctamente",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                apellido: updatedUser.apellido,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address
            }
        });
    } catch (error: any) {
        console.error("POST_PROFILE_ERROR:", error);
        return NextResponse.json({ error: error.message || "Error al actualizar perfil en la base de datos" }, { status: 500 });
    }
}
