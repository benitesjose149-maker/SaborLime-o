"use client";

import Image from "next/image";
import Link from "next/link";
import { menuData } from "./menuData";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CartaPage() {
    const { user } = useAuth();
    const router = useRouter();

    const handleOrder = (itemName: string) => {
        if (!user) {
            router.push("/login");
            return;
        }
        const whatsappUrl = `https://wa.me/51984256122?text=Hola,%20quiero%20pedir%20${encodeURIComponent(itemName)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-20">
            {/* Hero Small */}
            <div className="bg-brand-red py-12 px-4 text-center text-white mb-12">
                <h1 className="font-serif text-4xl md:text-5xl mb-4">Nuestra Carta</h1>
                <p className="text-red-100 italic">Tradición y sabor en cada plato</p>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {menuData.map((category, catIdx) => (
                    <div key={catIdx} className="mb-16">
                        <h2 className="font-serif text-3xl text-brand-red mb-8 border-b-2 border-brand-yellow-light pb-2 inline-block">
                            {category.category}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {category.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                    <div className="relative h-48 w-full bg-gray-100">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
                                            <span className="font-bold text-brand-red text-lg">{item.price}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-6 leading-relaxed italic">
                                            {item.description}
                                        </p>
                                        <button
                                            onClick={() => handleOrder(item.name)}
                                            className="w-full inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors gap-2 cursor-pointer"
                                        >
                                            <span>Pedir por WhatsApp</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
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
