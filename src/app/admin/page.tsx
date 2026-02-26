"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit2, Save, X, Layout, Info, Phone, MessageSquare, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [success, setSuccess] = useState("");

    const [heroContent, setHeroContent] = useState({
        home_hero_title: "",
        home_hero_subtitle: ""
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
            const res = await fetch("/api/admin/content?prefix=home_hero");
            const data = await res.json();
            setHeroContent({
                home_hero_title: data.home_hero_title || "Sabor Limeño",
                home_hero_subtitle: data.home_hero_subtitle || "La auténtica experiencia de la comida criolla."
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

    const handleSaveHero = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(heroContent)
            });
            if (res.ok) {
                setSuccess("¡Portada actualizada correctamente!");
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            console.error("Error saving content:", err);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Panel de Control</h1>
                    <p className="text-gray-600">Gestiona el contenido principal de tu sitio web desde aquí.</p>
                </div>

                {success && (
                    <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl flex items-center gap-3 animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <p className="text-green-700 font-medium">{success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Editor */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Editor */}
                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                                        <Layout className="w-5 h-5 text-brand-red" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Editar Portada (Inicio)</h2>
                                </div>
                            </div>

                            <form onSubmit={handleSaveHero} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título Principal</label>
                                    <input
                                        type="text"
                                        value={heroContent.home_hero_title}
                                        onChange={(e) => setHeroContent({ ...heroContent, home_hero_title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all font-serif text-2xl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subtítulo / Descripción</label>
                                    <textarea
                                        rows={3}
                                        value={heroContent.home_hero_subtitle}
                                        onChange={(e) => setHeroContent({ ...heroContent, home_hero_subtitle: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none text-gray-600"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="bg-brand-red hover:bg-red-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Right Column: Navigation Shortcuts */}
                    <div className="space-y-6">
                        <div className="bg-brand-red rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-serif font-bold mb-4">Atajos Rápidos</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push("/admin/carta")}
                                        className="w-full flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Layout className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">La Carta</p>
                                            <p className="text-xs text-white/60">Gestionar platos</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => router.push("/admin/nosotros")}
                                        className="w-full flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Info className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Nosotros</p>
                                            <p className="text-xs text-white/60">Historia y visión</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => router.push("/admin/contacto")}
                                        className="w-full flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Contacto</p>
                                            <p className="text-xs text-white/60">Datos de contacto</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-brand-yellow/20 flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-brand-red" />
                                </div>
                                <h4 className="font-bold text-gray-800">Consejo Admin</h4>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Usa el botón <span className="font-bold text-brand-red">"VER WEB"</span> arriba a la derecha para ver cómo quedan tus cambios antes de compartirlos con tus clientes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
