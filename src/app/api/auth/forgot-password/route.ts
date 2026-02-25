import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email requerido" }, { status: 400 });
        }

        // 1. Verificar si el usuario existe
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Por seguridad, no decimos si el usuario existe o no, 
            // pero el frontend ya sabe manejar el mensaje genérico.
            return NextResponse.json({ message: "Si el correo existe, el código ha sido enviado." });
        }

        // 2. Generar código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        // 3. Guardar en VerificationToken
        // Forzamos el tipo a 'any' para evitar errores visuales del IDE (Ghost Errors)
        await (prisma as any).verificationToken.upsert({
            where: { token: code },
            update: { expires },
            create: {
                identifier: email,
                token: code,
                expires
            }
        });

        console.log(`[AUTH] Código de recuperación para ${email}: ${code}`);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Solo intentamos enviar si hay credenciales, sino solo logueamos
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail({
                from: '"Sabor Limeño" <noreply@saborlimeno.com>',
                to: email,
                subject: "Código de Verificación - Sabor Limeño",
                text: `Tu código para restablecer tu contraseña es: ${code}. Vence en 15 minutos.`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #8b0000;">Sabor Limeño</h2>
                        <p>Hola,</p>
                        <p>Has solicitado restablecer tu contraseña. Tu código de verificación es:</p>
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; text-align: center; padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0;">
                            ${code}
                        </div>
                        <p>Este código vencerá en 15 minutos. Si no solicitaste esto, puedes ignorar este correo.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #666;">© 2026 Sabor Limeño - Comida Criolla</p>
                    </div>
                `,
            });
        }

        return NextResponse.json({ message: "Código enviado con éxito." });

    } catch (error) {
        console.error("FORGOT_PASSWORD_ERROR:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
