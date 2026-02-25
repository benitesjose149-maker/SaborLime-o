import Image from "next/image";
import Link from "next/link";

export default function NosotrosPage() {
    return (
        <main className="min-h-screen bg-white pb-20 pt-20">
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-brand-red">
                    {/* Base color while image loads or if missing */}
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="font-serif text-5xl text-white mb-4">Nuestra Historia</h1>
                    <p className="text-brand-yellow-light italic text-xl">Tradición que se hereda, sabor que se comparte</p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                    <div className="order-2 md:order-1">
                        <h2 className="font-serif text-3xl text-brand-red mb-6">Desde el corazón de Lima</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Sabor Limeño nació hace más de 15 años como un pequeño sueño familiar en el centro de Lima. Nuestra fundadora, Doña Juana, siempre creyó que la comida criolla no solo alimenta el cuerpo, sino que también reconforta el alma.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Hoy, seguimos manteniendo las mismas recetas secretas, usando los ingredientes más frescos del mercado y dedicando el mismo cariño a cada plato que sale de nuestra cocina.
                        </p>
                    </div>
                    <div className="order-1 md:order-2 bg-gray-100 rounded-2xl h-[400px] flex items-center justify-center text-gray-400 italic border-2 border-brand-yellow">
                        {/* Image Placeholder */}
                        Foto del equipo / Local
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
                    <div className="bg-gray-50 p-10 rounded-2xl">
                        <span className="text-4xl mb-4 block">🎯</span>
                        <h3 className="font-serif text-2xl text-brand-red mb-4">Misión</h3>
                        <p className="text-gray-600">
                            Preservar y difundir la auténtica sazón criolla peruana a través de ingredientes de calidad y un servicio que te haga sentir como en casa.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-10 rounded-2xl">
                        <span className="text-4xl mb-4 block">👁️</span>
                        <h3 className="font-serif text-2xl text-brand-red mb-4">Visión</h3>
                        <p className="text-gray-600">
                            Ser reconocidos como el restaurante referente de comida casera en Lima, donde la tradición y la modernidad se encuentran en cada mesa.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
