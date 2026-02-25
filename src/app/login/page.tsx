"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuth();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
        } catch (err) {
            setError("Credenciales incorrectas. Intenta de nuevo.");
        }
    };

    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left side: Form */}
            <div className="flex items-center justify-center p-8 bg-white pt-24 lg:pt-8">
                <div className="w-full max-w-md">
                    <Link href="/" className="inline-block mb-12">
                        <h1 className="font-serif text-3xl text-brand-red font-bold">Sabor Limeño</h1>
                    </Link>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido de nuevo!</h2>
                    <p className="text-gray-600 mb-8">Inicia sesión para realizar tus pedidos.</p>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700">Contraseña</label>
                                <Link href="/forgot-password" title="recuperar contraseña" className="text-xs text-brand-red font-medium hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
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
                            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
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
                            ¿No tienes una cuenta?{" "}
                            <Link href="/register" className="text-brand-red font-bold hover:underline">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side: Decorative */}
            <div className="hidden lg:block relative bg-brand-red p-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/aji.png"
                        alt="Sabor Limeño Login"
                        fill
                        sizes="50vw"
                        className="object-cover opacity-30"
                    />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-end text-white">
                    <blockquote className="text-3xl font-serif italic mb-6">
                        "La comida peruana es el abrazo que te da tu tierra, no importa donde estés."
                    </blockquote>
                    <p className="text-brand-yellow font-bold">— Doña Juana, Fundadora</p>
                </div>
            </div>
        </main>
    );
}
