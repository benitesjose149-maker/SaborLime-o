"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Edit2, Save, Info, CheckCircle2, Award, Target, Eye } from "lucide-react";

export default function AdminNosotrosPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [success, setSuccess] = useState("");

    const [content, setContent] = useState({
        nosotros_history_title: "",
        nosotros_history_text1: "",
        nosotros_history_text2: "",
        nosotros_mission: "",
        nosotros_vision: ""
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role?.toUpperCase() !== "ADMIN")) {
            router.push("/");
        } else if (user) {
            fetchContent();
        }
    }, [user, authLoading, router]);

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/admin/content?prefix=nosotros");
            const data = await res.json();
            setContent({
                nosotros_history_title: data.nosotros_history_title || "Desde el corazón de Lima",
                nosotros_history_text1: data.nosotros_history_text1 || "Sabor Limeño nació hace más de 15 años como un pequeño sueño familiar en el centro de Lima. Nuestra fundadora, Doña Juana, siempre creyó que la comida criolla no solo alimenta el cuerpo, sino que también reconforta el alma.",
                nosotros_history_text2: data.nosotros_history_text2 || "Hoy, seguimos manteniendo las mismas recetas secretas, usando los ingredientes más frescos del mercado y dedicando el mismo cariño a cada plato que sale de nuestra cocina.",
                nosotros_mission: data.nosotros_mission || "Preservar y difundir la auténtica sazón criolla peruana a través de ingredientes de calidad y un servicio que te haga sentir como en casa.",
                nosotros_vision: data.nosotros_vision || "Ser reconocidos como el restaurante referente de comida casera en Lima, donde la tradición y la modernidad se encuentran en cada mesa."
            });
        } catch (err) {
            console.error("Error fetching content:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || isLoading) {
        return <div className="min-h-screen flex items-center justify-center pt-24 font-serif text-xl text-brand-red animate-pulse">Cargando Administración...</div>;
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content)
            });
            if (res.ok) {
                setSuccess("¡Sección 'Nosotros' actualizada correctamente!");
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            console.error("Error saving content:", err);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Editar Nosotros</h1>
                        <p className="text-gray-600">Personaliza la historia y los valores de Sabor Limeño.</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center">
                        <Info className="w-6 h-6 text-brand-red" />
                    </div>
                </div>

                {success && (
                    <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl flex items-center gap-3 animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <p className="text-green-700 font-medium">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Historia Section */}
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Award className="w-5 h-5 text-brand-red" />
                                Nuestra Historia
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título de Historia</label>
                                <input
                                    type="text"
                                    value={content.nosotros_history_title}
                                    onChange={(e) => setContent({ ...content, nosotros_history_title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all font-serif text-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Párrafo 1</label>
                                <textarea
                                    rows={4}
                                    value={content.nosotros_history_text1}
                                    onChange={(e) => setContent({ ...content, nosotros_history_text1: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Párrafo 2</label>
                                <textarea
                                    rows={4}
                                    value={content.nosotros_history_text2}
                                    onChange={(e) => setContent({ ...content, nosotros_history_text2: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none text-gray-600"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Mision & Vision Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-brand-red" />
                                    Misión
                                </h2>
                            </div>
                            <div className="p-8">
                                <textarea
                                    rows={4}
                                    value={content.nosotros_mission}
                                    onChange={(e) => setContent({ ...content, nosotros_mission: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none text-gray-600 text-sm"
                                />
                            </div>
                        </section>

                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-brand-red" />
                                    Visión
                                </h2>
                            </div>
                            <div className="p-8">
                                <textarea
                                    rows={4}
                                    value={content.nosotros_vision}
                                    onChange={(e) => setContent({ ...content, nosotros_vision: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none text-gray-600 text-sm"
                                />
                            </div>
                        </section>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-brand-red hover:bg-red-800 text-white font-bold px-12 py-4 rounded-2xl transition-all shadow-xl flex items-center gap-3 transform hover:scale-105 active:scale-95"
                        >
                            <Save className="w-6 h-6" />
                            Actualizar Toda la Sección
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
