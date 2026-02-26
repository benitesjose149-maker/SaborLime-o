import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const dishes = await prisma.dish.findMany({
            where: { available: true },
            orderBy: { category: "asc" }
        });
        return NextResponse.json(dishes);
    } catch (error) {
        console.error("Error fetching dishes:", error);
        return NextResponse.json({ error: "Error al obtener la carta" }, { status: 500 });
    }
}
