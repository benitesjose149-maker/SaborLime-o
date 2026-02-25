"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Shield, Clock, Save, Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries: any = ["places"];

export default function ProfilePage() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries
    });
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // States for form fields
    const [name, setName] = useState("");
    const [apellido, setApellido] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // Autocomplete logic
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleAddressSearch = async (query: string) => {
        if (query.length > 2) {
            // Usar Google Maps API real (Versión Moderna 2025)
            if (isLoaded && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
                try {
                    // Para nuevos clientes de Google, se prefiere usar AutocompleteService pero con manejo de sesión
                    // o el nuevo sistema de Autocomplete. Usaremos el AutocompleteService compatible con la librería.
                    const service = new google.maps.places.AutocompleteService();
                    service.getPlacePredictions({
                        input: query,
                        componentRestrictions: { country: 'pe' }
                    }, (predictions, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                            setSuggestions(predictions.map(p => p.description));
                            setShowSuggestions(true);
                        } else {
                            console.error("Maps status:", status);
                        }
                    });
                } catch (e) {
                    console.error("Google Maps Error:", e);
                }
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user?.email) {
            fetchProfile();
        }
    }, [user, authLoading]);

    const fetchProfile = async () => {
        setIsFetching(true);
        try {
            const res = await fetch(`/api/user/profile?email=${user?.email}`);
            const data = await res.json();
            if (res.ok) {
                setProfile(data);
                setName(data.name || "");
                setApellido(data.apellido || "");
                setPhone(data.phone || "");
                setAddress(data.address || "");
            }
        } catch (error) {
            console.error("Fetch profile error:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user?.email,
                    name,
                    apellido,
                    phone,
                    address
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Perfil actualizado correctamente." });
                // Update local storage to keep name in sync with Navbar
                const savedUser = localStorage.getItem("sabor_user");
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    localStorage.setItem("sabor_user", JSON.stringify({ ...parsed, name }));
                }
            } else {
                setMessage({ type: "error", text: data.error || "Error al actualizar." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Error de conexión." });
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-brand-red animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium font-serif">Preparando tu perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 bg-white rounded-full shadow-sm hover:text-brand-red transition-all">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 font-serif">Mi Perfil</h1>
                        <p className="text-gray-500 text-sm">Gestiona tu información y seguridad</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Summary */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 text-center border border-white">
                            <div className="w-24 h-24 rounded-full bg-brand-yellow-light text-brand-red text-4xl font-bold flex items-center justify-center mx-auto mb-4 ring-4 ring-brand-yellow/20">
                                {profile?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{profile?.name} {profile?.apellido}</h2>
                            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mt-1">Cliente {profile?.provider === 'google' ? 'Google' : 'VIP'}</p>

                            <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>Miembro desde</span>
                                    </div>
                                    <span className="font-bold text-gray-700">
                                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "---"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Shield className="w-4 h-4" />
                                        <span>Estado</span>
                                    </div>
                                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">Activo</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Security Card */}
                        <div className="bg-brand-red text-white rounded-3xl p-6 shadow-xl shadow-brand-red/20 overflow-hidden relative group">
                            <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-lg font-bold mb-2">Seguridad</h3>
                            <p className="text-white/80 text-xs mb-4">¿Quieres cambiar tu clave de acceso?</p>
                            <Link href="/forgot-password" title="Cambiar contraseña" className="inline-block bg-white text-brand-red px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-yellow transition-all">
                                Pedir Reset de Clave
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="md:col-span-2 space-y-8">
                        <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white">
                            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <User className="w-5 h-5 text-brand-red" />
                                    Datos Personales
                                </h3>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-2 bg-brand-red text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-800 transition-all shadow-md disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? "Guardando..." : "Guardar"}
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombres</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-100/50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-700"
                                                placeholder="Tus nombres"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Apellidos</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            <input
                                                type="text"
                                                value={apellido}
                                                onChange={(e) => setApellido(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-100/50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-700"
                                                placeholder="Tus apellidos"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Segunda Fila: Email y Teléfono */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email (No editable)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            <input
                                                type="email"
                                                value={profile?.email || user?.email || ""}
                                                disabled
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl outline-none cursor-not-allowed font-medium text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Teléfono Movil</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-100/50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-700"
                                                placeholder="+51 900 000 000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tercera Fila: Dirección (Ancho completo) */}
                                <div className="relative">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Dirección de Entrega</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => {
                                                setAddress(e.target.value);
                                                handleAddressSearch(e.target.value);
                                            }}
                                            onFocus={() => address.length > 2 && setShowSuggestions(true)}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-100/50 border border-transparent focus:border-brand-red focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-700"
                                            placeholder="Av. Principal 123, Lima"
                                        />
                                    </div>

                                    {/* Suggestions Dropdown - GRAN FORMATO */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <div className="max-h-[450px] overflow-y-auto">
                                                {suggestions.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => {
                                                            setAddress(s);
                                                            setShowSuggestions(false);
                                                        }}
                                                        className="w-full flex items-start gap-4 px-6 py-4 hover:bg-brand-yellow-light/30 text-left transition-colors border-b border-gray-50 last:border-0 group"
                                                    >
                                                        <div className="bg-gray-100 p-2.5 rounded-full text-brand-red shrink-0 group-hover:bg-white transition-colors shadow-sm mt-0.5">
                                                            <MapPin className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-[15px] font-semibold text-gray-800 leading-snug">
                                                                {s}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">
                                                                Ubicación Verificada por Google
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>

                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-white">
                            <h3 className="font-serif text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <ShoppingBag className="w-6 h-6 text-brand-red" />
                                Resumen de Pedidos
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-brand-yellow/10 rounded-3xl border border-brand-yellow/20">
                                    <p className="text-xs text-brand-red font-bold uppercase tracking-wider mb-1">Pedidos Totales</p>
                                    <p className="text-3xl font-bold text-brand-red underline decoration-brand-yellow">0</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Cupos Disponibles</p>
                                    <p className="text-3xl font-bold text-gray-500">5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
