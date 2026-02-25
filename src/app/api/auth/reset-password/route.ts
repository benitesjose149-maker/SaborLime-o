import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, code, password } = await req.json();

        if (!email || !code || !password) {
            return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
        }

        // 1. Buscar el token en la base de datos
        // Forzamos a 'any' para evitar errores visuales del IDE
        const verificationToken = await (prisma as any).verificationToken.findFirst({
            where: {
                identifier: email,
                token: code
            }
        });

        if (!verificationToken) {
            return NextResponse.json({ error: "Código incorrecto o inválido" }, { status: 400 });
        }

        // 2. Verificar expiración
        if (new Date() > verificationToken.expires) {
            return NextResponse.json({ error: "El código ha expirado. Pide uno nuevo." }, { status: 400 });
        }

        // 3. Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Actualizar usuario
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        // 5. Eliminar el token usado
        await (prisma as any).verificationToken.delete({
            where: { token: code }
        });

        return NextResponse.json({ message: "Contraseña actualizada correctamente" });

    } catch (error) {
        console.error("RESET_PASSWORD_ERROR:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
