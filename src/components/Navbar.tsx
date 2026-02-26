"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, LogOut, ChevronDown, UserCircle, Settings } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) console.log("LOG [Navbar]: user state ->", user);
    }, [user]);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Don't show navbar on login/register pages
    if (pathname === "/login" || pathname === "/register") return null;

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "La Carta", href: "/carta" },
        { name: "Nosotros", href: "/nosotros" },
        { name: "Contacto", href: "/contacto" },
    ];

    return (
        <header className="bg-brand-red/90 backdrop-blur-md text-white py-6 px-4 fixed top-0 w-full z-50 shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link
                    href={user?.role?.toUpperCase() === "ADMIN" ? "/admin/carta" : "/"}
                    className="font-serif text-2xl font-bold"
                >
                    Sabor Limeño
                </Link>

                <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-wider items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${pathname === link.href ? 'text-brand-yellow font-bold' : 'hover:text-brand-yellow transition-colors'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user?.role?.toUpperCase() === "ADMIN" && (
                        <Link
                            href="/"
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-[10px] font-bold border border-white/20 transition-all flex items-center gap-2"
                        >
                            <User className="w-3 h-3" />
                            VER WEB
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                onMouseEnter={() => setIsMenuOpen(true)}
                                className="flex items-center gap-2 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-red font-bold border-2 border-white/20 group-hover:border-brand-yellow transition-all shadow-md">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:flex flex-col items-start leading-tight">
                                    <span className="text-[10px] uppercase font-bold tracking-tighter text-brand-yellow/80">Bienvenido</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-bold">{user.name.split(' ')[0]}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <div
                                onMouseLeave={() => setIsMenuOpen(false)}
                                className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top-right ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                    }`}>
                                <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Mi Cuenta</p>
                                    <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-400 rounded uppercase tracking-wider border border-gray-200">
                                        Rol: {user.role}
                                    </span>
                                </div>

                                <div className="p-2">
                                    <Link
                                        href="/perfil"
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
                                    >
                                        <UserCircle className="w-5 h-5 text-gray-400 group-hover:text-brand-red" />
                                        <span className="text-sm font-medium">Mi Perfil</span>
                                    </Link>

                                    <Link
                                        href="/pedidos"
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
                                    >
                                        <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-brand-red" />
                                        <span className="text-sm font-medium">Mis Pedidos</span>
                                    </Link>

                                    {user.role?.toUpperCase() === "ADMIN" && (
                                        <Link
                                            href="/admin/carta"
                                            className="flex items-center gap-3 px-4 py-3 text-brand-red hover:bg-red-50 rounded-xl transition-colors group"
                                        >
                                            <Settings className="w-5 h-5 text-brand-red/60 group-hover:text-brand-red" />
                                            <span className="text-sm font-bold">Administración</span>
                                        </Link>
                                    )}
                                </div>

                                <div className="p-2 border-t border-gray-100 bg-gray-50/30">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="text-sm font-bold">Cerrar Sesión</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-brand-yellow text-brand-red px-6 py-2 rounded-full font-bold text-sm hover:bg-white transition-all shadow-lg"
                        >
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
