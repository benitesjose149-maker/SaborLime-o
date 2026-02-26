"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Edit2, Save, Phone, CheckCircle2, MapPin, Clock, MessageCircle } from "lucide-react";

export default function AdminContactoPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [success, setSuccess] = useState("");

    const [content, setContent] = useState({
        contacto_address: "",
        contacto_phone: "",
        contacto_whatsapp: "",
        contacto_hours: "",
        contacto_email: ""
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
            const res = await fetch("/api/admin/content?prefix=contacto");
            const data = await res.json();
            setContent({
                contacto_address: data.contacto_address || "Av. Principal 123, Miraflores, Lima",
                contacto_phone: data.contacto_phone || "+51 984 256 122",
                contacto_whatsapp: data.contacto_whatsapp || "+51 984 256 122",
                contacto_hours: data.contacto_hours || "Lunes a Domingo: 12:00 PM - 10:00 PM",
                contacto_email: data.contacto_email || "reservas@saborlimeno.com"
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
                setSuccess("¡Datos de contacto actualizados correctamente!");
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
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Editar Contacto</h1>
                        <p className="text-gray-600">Gestiona la información que tus clientes usan para encontrarte.</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-brand-red" />
                    </div>
                </div>

                {success && (
                    <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl flex items-center gap-3 animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <p className="text-green-700 font-medium">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Contact Info Card */}
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-brand-red" />
                                Ubicación y Canales
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dirección Física</label>
                                    <input
                                        type="text"
                                        value={content.contacto_address}
                                        onChange={(e) => setContent({ ...content, contacto_address: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all text-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Teléfono / Celular</label>
                                    <input
                                        type="text"
                                        value={content.contacto_phone}
                                        onChange={(e) => setContent({ ...content, contacto_phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all text-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">WhatsApp Link</label>
                                    <div className="relative">
                                        <MessageCircle className="absolute left-4 top-3.5 w-4 h-4 text-green-500" />
                                        <input
                                            type="text"
                                            value={content.contacto_whatsapp}
                                            onChange={(e) => setContent({ ...content, contacto_whatsapp: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all text-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Schedule Card */}
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-brand-red" />
                                Horarios de Atención
                            </h2>
                        </div>
                        <div className="p-8">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Detalle de Horarios</label>
                            <input
                                type="text"
                                value={content.contacto_hours}
                                onChange={(e) => setContent({ ...content, contacto_hours: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all text-gray-700"
                            />
                            <p className="mt-3 text-[10px] text-gray-400 italic">Ej: Lunes a Viernes: 9am - 6pm</p>
                        </div>
                    </section>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-brand-red hover:bg-red-800 text-white font-bold px-12 py-4 rounded-2xl transition-all shadow-xl flex items-center gap-3 transform hover:scale-105 active:scale-95"
                        >
                            <Save className="w-6 h-6" />
                            Guardar Información
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
