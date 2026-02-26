import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function NosotrosPage() {
    // Fetch content from database with error handling
    let contentData = [];
    try {
        if (prisma && prisma.pageContent) {
            contentData = await prisma.pageContent.findMany({
                where: {
                    key: {
                        startsWith: 'nosotros'
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error fetching nosotros content:", error);
    }

    const content = contentData.reduce((acc: Record<string, string>, curr: { key: string, value: string }) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    const historyTitle = content.nosotros_history_title || "Desde el corazón de Lima";
    const historyText1 = content.nosotros_history_text1 || "Sabor Limeño nació hace más de 15 años como un pequeño sueño familiar en el centro de Lima. Nuestra fundadora, Doña Juana, siempre creyó que la comida criolla no solo alimenta el cuerpo, sino que también reconforta el alma.";
    const historyText2 = content.nosotros_history_text2 || "Hoy, seguimos manteniendo las mismas recetas secretas, usando los ingredientes más frescos del mercado y dedicando el mismo cariño a cada plato que sale de nuestra cocina.";
    const mission = content.nosotros_mission || "Preservar y difundir la auténtica sazón criolla peruana a través de ingredientes de calidad y un servicio que te haga sentir como en casa.";
    const vision = content.nosotros_vision || "Ser reconocidos como el restaurante referente de comida casera en Lima, donde la tradición y la modernidad se encuentran en cada mesa.";

    return (
        <main className="min-h-screen bg-white pb-20 pt-20">
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-brand-red">
                    <Image
                        src="/images/banner.png"
                        alt="Restaurante Sabor Limeño"
                        fill
                        className="object-cover brightness-50"
                    />
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="font-serif text-5xl text-white mb-4">Nuestra Historia</h1>
                    <p className="text-brand-yellow-light italic text-xl">Tradición que se hereda, sabor que se comparte</p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                    <div className="order-2 md:order-1">
                        <h2 className="font-serif text-3xl text-brand-red mb-6">{historyTitle}</h2>
                        <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
                            {historyText1}
                        </p>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {historyText2}
                        </p>
                    </div>
                    <div className="order-1 md:order-2 bg-gray-100 rounded-2xl h-[400px] overflow-hidden relative border-2 border-brand-yellow">
                        <Image
                            src="/images/aji.png"
                            alt="Plato típico Sabor Limeño"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
                    <div className="bg-gray-50 p-10 rounded-2xl">
                        <span className="text-4xl mb-4 block">🎯</span>
                        <h3 className="font-serif text-2xl text-brand-red mb-4">Misión</h3>
                        <p className="text-gray-600">
                            {mission}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-10 rounded-2xl">
                        <span className="text-4xl mb-4 block">👁️</span>
                        <h3 className="font-serif text-2xl text-brand-red mb-4">Visión</h3>
                        <p className="text-gray-600">
                            {vision}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
