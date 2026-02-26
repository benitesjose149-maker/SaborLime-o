"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { User as UserIcon, ShoppingBag, LogOut, ChevronDown, UserCircle, Settings, Menu, X } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) console.log("LOG [Navbar]: user state ->", user);
    }, [user]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (pathname === "/login" || pathname === "/register") return null;

    const isAdminRoute = pathname.startsWith("/admin");
    const isAdmin = user?.role?.toUpperCase() === "ADMIN";

    const navLinks = (isAdmin && isAdminRoute)
        ? [
            { name: "Inicio", href: "/admin" },
            { name: "Pedidos 🔔", href: "/admin/pedidos" },
            { name: "La Carta", href: "/admin/carta" },
            { name: "Nosotros", href: "/admin/nosotros" },
            { name: "Contacto", href: "/admin/contacto" },
        ]
        : [
            { name: "Inicio", href: "/" },
            { name: "La Carta", href: "/carta" },
            { name: "Nosotros", href: "/nosotros" },
            { name: "Contacto", href: "/contacto" },
        ];

    return (
        <>
            <header className="bg-brand-red/90 backdrop-blur-md text-white py-6 px-4 fixed top-0 w-full z-50 shadow-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden flex items-center justify-center p-2 text-white hover:bg-white/10 rounded-xl transition-all z-50 shrink-0"
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>

                        <Link
                            href={(isAdmin && isAdminRoute) ? "/admin/carta" : "/"}
                            className="font-serif text-xl sm:text-2xl font-bold truncate tracking-tight transition-all hover:text-brand-yellow shrink"
                        >
                            Sabor Limeño
                        </Link>
                    </div>

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
                        {isAdmin && (
                            <Link
                                href={isAdminRoute ? "/" : "/admin"}
                                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-[10px] font-bold border border-white/20 transition-all flex items-center gap-2"
                            >
                                <Settings className="w-3 h-3" />
                                {isAdminRoute ? "VER WEB" : "ADMINISTRACIÓN"}
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

            {/* Mobile Navigation - Outside header context */}
            <div
                className={`md:hidden fixed inset-0 bg-black z-[100] transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-70' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
                ref={mobileMenuRef}
                className={`md:hidden fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#800000] p-10 shadow-2xl transition-transform duration-500 transform z-[110] flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-12 flex justify-between items-center text-white">
                    <span className="font-serif text-3xl font-bold">Menú</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white transition-colors cursor-pointer">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <nav className="flex flex-col gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-lg font-bold uppercase tracking-wider transition-colors ${pathname === link.href ? 'text-brand-yellow scale-105 origin-left' : 'text-white hover:text-brand-yellow'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-px bg-white/10 my-4" />

                    {isAdmin && (
                        <Link
                            href={isAdminRoute ? "/" : "/admin"}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="bg-white/10 text-white px-6 py-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 border border-white/20 active:bg-white/20 active:scale-95 transition-all shadow-lg"
                        >
                            <Settings className="w-5 h-5" />
                            {isAdminRoute ? "VER WEB" : "ADMINISTRACIÓN"}
                        </Link>
                    )}
                </nav>

                <div className="mt-auto pt-10">
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Siguenos en Redes</p>
                    <div className="flex gap-4">
                        <a href="#" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90">IG</a>
                        <a href="#" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90">FB</a>
                    </div>
                </div>
            </div>
        </>
    );
}
