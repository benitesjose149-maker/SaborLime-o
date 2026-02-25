"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // Importación necesaria
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register, isLoading } = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await register(name, email, password);
            router.push("/");
        } catch (err) {
            setError("Ocurrió un error al registrarte. Intenta de nuevo.");
        }
    };

    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Decorative Side */}
            <div className="hidden lg:block relative bg-brand-red p-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/loo.png"
                        alt="Sabor Limeño Registro"
                        fill
                        sizes="50vw"
                        className="object-cover opacity-30"
                    />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-center text-white text-center">
                    <h2 className="font-serif text-5xl mb-6">Únete a la familia</h2>
                    <p className="text-xl text-brand-yellow-light italic">
                        Disfruta de beneficios exclusivos y haz tus pedidos más rápido.
                    </p>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <Link href="/" className="inline-block mb-12">
                        <h1 className="font-serif text-3xl text-brand-red font-bold">Sabor Limeño</h1>
                    </Link>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Crea tu cuenta</h2>
                    <p className="text-gray-600 mb-8">Sé parte de la mejor experiencia criolla en Lima.</p>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red outline-none transition-all"
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red outline-none transition-all"
                                placeholder="tu@correo.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-red hover:bg-red-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center cursor-pointer"
                        >
                            {isLoading ? "Creando cuenta..." : "Registrarse"}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 uppercase tracking-widest text-xs">O continúa con</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center space-y-4">
                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700 cursor-pointer"
                        >
                            <Image
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="GoogleLogo"
                                width={20}
                                height={20}
                            />
                            Continuar con Google
                        </button>
                        <p className="text-gray-600">
                            ¿Ya tienes una cuenta?{" "}
                            <Link href="/login" className="text-brand-red font-bold hover:underline">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
