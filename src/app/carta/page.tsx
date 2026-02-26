"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Dish {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available: boolean;
}

export default function CartaPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const res = await fetch("/api/dishes");
                const data = await res.json();
                if (res.ok) setDishes(data);
            } catch (err) {
                console.error("Error al cargar la carta", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDishes();
    }, []);

    const handleOrder = (itemName: string) => {
        if (!user) {
            router.push("/login");
            return;
        }
        const whatsappUrl = `https://wa.me/51984256122?text=Hola,%20quiero%20pedir%20${encodeURIComponent(itemName)}`;
        window.open(whatsappUrl, "_blank");
    };

    // Agrupar platos por categoría
    const categories = Array.from(new Set(dishes.map(d => d.category)));

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-20">
            {/* Hero Small */}
            <div className="bg-brand-red py-12 px-4 text-center text-white mb-12">
                <h1 className="font-serif text-4xl md:text-5xl mb-4">Nuestra Carta</h1>
                <p className="text-red-100 italic">Tradición y sabor en cada plato</p>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {categories.map((category, catIdx) => (
                    <div key={catIdx} className="mb-16">
                        <h2 className="font-serif text-3xl text-brand-red mb-8 border-b-2 border-brand-yellow-light pb-2 inline-block">
                            {category}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {dishes.filter(d => d.category === category).map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                    <div className="relative h-48 w-full bg-gray-100 group-hover:scale-105 transition-transform duration-500">
                                        <Image
                                            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        {!item.available && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Agotado</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-xl text-gray-800 transition-colors group-hover:text-brand-red">{item.name}</h3>
                                            <span className="font-bold text-brand-red text-lg">S/ {Number(item.price).toFixed(2)}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-6 leading-relaxed italic line-clamp-2">
                                            {item.description}
                                        </p>
                                        <button
                                            onClick={() => item.available && handleOrder(item.name)}
                                            disabled={!item.available}
                                            className={`w-full inline-flex items-center justify-center font-bold py-3 px-6 rounded-lg transition-colors gap-2 cursor-pointer ${item.available
                                                ? "bg-green-600 hover:bg-green-700 text-white shadow-md active:scale-95"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            <span>{item.available ? "Pedir por WhatsApp" : "No disponible"}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {dishes.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 italic">No hay platos disponibles en este momento.</p>
                    </div>
                )}
            </div>

            <div className="text-center mt-8">
                <Link
                    href="/"
                    className="text-brand-red hover:underline font-bold"
                >
                    &larr; Volver al inicio
                </Link>
            </div>
        </main>
    );
}
