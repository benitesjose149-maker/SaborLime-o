"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    ShoppingBag,
    Clock,
    CheckCircle2,
    XCircle,
    Phone,
    MapPin,
    MessageCircle,
    Bell,
    BellOff,
    MoreVertical,
    ChevronRight,
    Search
} from "lucide-react";

export default function AdminPedidosPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("TODOS");

    const prevOrdersCount = useRef(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role?.toUpperCase() !== "ADMIN")) {
            router.push("/");
        } else if (user) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            if (res.ok) {
                const data = await res.json();

                // Check for new orders to play sound
                const pendingOrders = data.filter((o: any) => o.status === "PENDIENTE");
                if (notificationsEnabled && pendingOrders.length > prevOrdersCount.current) {
                    playNotificationSound();
                }
                prevOrdersCount.current = pendingOrders.length;

                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        }
    };

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus })
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(order.id).includes(searchTerm);
        const matchesStatus = statusFilter === "TODOS" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (authLoading || isLoading) {
        return <div className="min-h-screen flex items-center justify-center pt-24 font-serif text-xl text-brand-red animate-pulse">Cargando Pedidos...</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
            {/* Hidden Audio element for notifications */}
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />

            <div className="max-w-7xl mx-auto">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pendientes</span>
                        </div>
                        <p className="text-3xl font-black text-gray-800">{orders.filter(o => o.status === "PENDIENTE").length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-brand-red" />
                            </div>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Hoy</span>
                        </div>
                        <p className="text-3xl font-black text-gray-800">{orders.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Completados</span>
                        </div>
                        <p className="text-3xl font-black text-gray-800">{orders.filter(o => o.status === "COMPLETADO").length}</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg ${notificationsEnabled ? 'bg-brand-red text-white' : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                            Alertas: {notificationsEnabled ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {["TODOS", "PENDIENTE", "EN PREPARACION", "COMPLETADO", "CANCELADO"].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${statusFilter === status
                                    ? 'bg-brand-red text-white'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white p-20 rounded-[3rem] text-center shadow-xl border border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 font-serif">No se encontraron pedidos</h3>
                            <p className="text-gray-400 mt-2">Intenta cambiar los filtros o el término de búsqueda.</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className={`bg-white rounded-[2.5rem] shadow-xl border overflow-hidden transition-all duration-300 hover:shadow-2xl ${order.status === 'PENDIENTE' ? 'border-brand-red shadow-brand-red/5' : 'border-gray-100'
                                }`}>
                                <div className="p-8 flex flex-col lg:flex-row gap-8">
                                    {/* Order Info */}
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="bg-gray-900 text-white font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-lg">#{order.id}</span>
                                            <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(order.createdAt).toLocaleString()}
                                            </span>
                                            {order.status === 'PENDIENTE' && (
                                                <span className="animate-pulse bg-brand-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">NUEVO PEDIDO</span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                            <div>
                                                <h3 className="text-[10px] font-black text-brand-red uppercase tracking-widest mb-3">Cliente</h3>
                                                <p className="text-xl font-black text-gray-800 mb-2">{order.user?.name || "Cliente Invitado"}</p>
                                                <div className="space-y-2">
                                                    <p className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                        <Phone className="w-4 h-4 text-brand-red/50" /> {order.phone || order.user?.phone || "No registrado"}
                                                    </p>
                                                    <p className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                        <MapPin className="w-4 h-4 text-brand-red/50" /> {order.address || order.user?.address || "Recojo en local"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-[10px] font-black text-brand-red uppercase tracking-widest mb-3">Pago: {order.paymentMethod}</h3>
                                                {order.paymentPhone && (
                                                    <div className="bg-brand-yellow/5 p-4 rounded-2xl border border-brand-yellow/20">
                                                        <p className="text-xs text-gray-500 mb-1">Celular: <span className="text-gray-800 font-bold">{order.paymentPhone}</span></p>
                                                        <p className="text-xs text-gray-500">Codigo: <span className="text-gray-800 font-black tracking-widest">{order.approvalCode}</span></p>
                                                    </div>
                                                )}
                                                <div className="mt-4 flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total</span>
                                                    <span className="text-2xl font-black text-brand-red">S/ {Number(order.total).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items list */}
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Detalle de Platos</h4>
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-brand-red text-xs">{item.quantity}x</span>
                                                        <span className="font-bold text-gray-700 text-sm">{item.dishName}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-400">S/ {(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Column */}
                                    <div className="lg:w-64 flex flex-col gap-4 border-l border-gray-50 lg:pl-8">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Estado del Pedido</h4>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'EN PREPARACION')}
                                                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${order.status === 'EN PREPARACION'
                                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-600'
                                                    }`}
                                            >
                                                Preparando
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'COMPLETADO')}
                                                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${order.status === 'COMPLETADO'
                                                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-700'
                                                    }`}
                                            >
                                                Completado
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'CANCELADO')}
                                                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${order.status === 'CANCELADO'
                                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-700'
                                                    }`}
                                            >
                                                Cancelar
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => {
                                                const text = `Hola ${order.user?.name || ''}, confirmamos la recepción de tu Pedido #${order.id}. Ya estamos manos a la obra!`;
                                                window.open(`https://wa.me/${(order.phone || order.user?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, "_blank");
                                            }}
                                            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-500/10"
                                        >
                                            <MessageCircle className="w-4 h-4" /> Notificar WhatsApp
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
