import Link from "next/link";

export default function ContactoPage() {
    return (
        <main className="min-h-screen bg-gray-50 pt-20">
            <div className="py-20 px-4 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="font-serif text-5xl text-brand-red mb-4">Ponte en Contacto</h1>
                    <p className="text-gray-600">¿Tienes alguna duda o quieres hacer una reserva especial?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Form Side */}
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Mensaje</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                    placeholder="Cuéntanos en qué podemos ayudarte..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-brand-red hover:bg-red-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
                            >
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>

                    {/* Info Side */}
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-2xl font-serif text-brand-red mb-6 border-b border-brand-yellow-light pb-2">Información de Contacto</h3>
                            <ul className="space-y-6 cursor-default">
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl mt-1">📍</span>
                                    <div>
                                        <p className="font-bold text-gray-800">Dirección</p>
                                        <p className="text-gray-600">Av. Principal 123, Miraflores, Lima</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl mt-1">📞</span>
                                    <div>
                                        <p className="font-bold text-gray-800">Teléfono / WhatsApp</p>
                                        <p className="text-gray-600">+51 984 256 122</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl mt-1">⏰</span>
                                    <div>
                                        <p className="font-bold text-gray-800">Horario de Atención</p>
                                        <p className="text-gray-600">Lunes a Domingo: 12:00 PM - 10:00 PM</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-brand-yellow-light/10 p-8 rounded-2xl border border-brand-yellow">
                            <h4 className="font-bold text-brand-red mb-2">¿Prefieres algo más directo?</h4>
                            <p className="text-sm text-gray-700 mb-4">Escríbenos directamente por WhatsApp para una atención inmediata.</p>
                            <Link
                                href="https://wa.me/51984256122"
                                target="_blank"
                                className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Chat por WhatsApp
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
