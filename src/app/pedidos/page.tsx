"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, MessageCircle, ShoppingBag, ArrowLeft, CheckCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
    const { cart, removeFromCart, totalPrice, clearCart, addToCart } = useCart();
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("YAPE");
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderHistory, setOrderHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    // Payment Modal States
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentPhone, setPaymentPhone] = useState("");
    const [approvalCode, setApprovalCode] = useState("");
    const [paymentDestination, setPaymentDestination] = useState("YAPE_P1"); // Account selector

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/orders/user");
            if (res.ok) {
                const data = await res.json();
                setOrderHistory(data);
            }
        } catch (error) {
            console.error("Error history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
            </div>
        );
    }

    const handleRepeatOrder = (order: any) => {
        order.items.forEach((item: any) => {
            const imageUrl = item.dishId === 'picarones' ? '/images/picarones.png' :
                item.dishId === 'anticuchos' ? 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop' :
                    '/images/loo.png';

            for (let i = 0; i < item.quantity; i++) {
                addToCart({
                    id: item.dishId,
                    name: item.dishName,
                    price: Number(item.price),
                    priceFormatted: `S/ ${Number(item.price).toFixed(2)}`,
                    image: imageUrl
                });
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFinalOrder = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    total: totalPrice,
                    paymentMethod: paymentMethod,
                    paymentPhone: paymentPhone,
                    approvalCode: approvalCode,
                }),
            });

            if (response.status === 401) {
                throw new Error("Tu sesión ha expirado o no estás autorizado. Por favor, cierra sesión e ingresa nuevamente.");
            }

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Error al guardar el pedido");
            }

            const savedOrder = await response.json();

            const itemsText = cart
                .map((item) => `- ${item.name} (x${item.quantity}) - ${item.priceFormatted}`)
                .join("\n");

            let paymentDetailsText = "";
            if (paymentMethod === "YAPE" || paymentMethod === "PLIN") {
                paymentDetailsText = `\n*Detalles de Pago:*\n- Celular Origen: ${paymentPhone}\n- Código: ${approvalCode}`;
            }

            const text = `¡Hola Sabor Limeño! 👋\n\nHe realizado el *Pedido #${savedOrder.id}* mediante la web:\n\n${itemsText}\n\n*Total: S/ ${totalPrice.toFixed(2)}*\n*Método de Pago: ${paymentMethod}*${paymentDetailsText}\n\n¿Me confirman para proceder? Gracias!`;

            const whatsappUrl = `https://wa.me/51984256122?text=${encodeURIComponent(text)}`;
            window.open(whatsappUrl, "_blank");

            // Clear cart and refresh history
            clearCart();
            await fetchHistory();
            setIsPaymentModalOpen(false);
            alert("¡Pedido realizado con éxito! Te hemos redirigido a WhatsApp para coordinar la entrega.");
            router.push("/");
        } catch (error: any) {
            console.error("Order error:", error);
            alert("Hubo un problema al procesar tu pedido: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const paymentOptions = [
        { id: "YAPE", name: "Yape" },
        { id: "PLIN", name: "Plin" },
        { id: "EFECTIVO", name: "Efectivo" },
        { id: "TARJETA", name: "Tarjeta" },
    ];

    return (
        <main className="min-h-screen pt-32 pb-24 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <Link href="/" className="inline-flex items-center gap-2 text-brand-red font-bold hover:underline mb-8 transition-all hover:-translate-x-1">
                    <ArrowLeft className="w-5 h-5" />
                    Volver a la carta
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="font-serif text-5xl md:text-6xl text-brand-red mb-3">Mis Pedidos</h1>
                        <p className="text-gray-500 text-lg italic max-w-xl leading-relaxed">
                            Casi listo. Revisa tu selección y elige cómo prefieres pagar para disfrutar del auténtico sabor limeño.
                        </p>
                    </div>
                    <div className="bg-brand-yellow/10 px-8 py-4 rounded-[2rem] border border-brand-yellow/20 shadow-sm">
                        <span className="text-xs font-bold text-brand-yellow uppercase tracking-[0.2em] block mb-1">Tu Selección</span>
                        <span className="text-3xl font-black text-brand-red">{cart.length} Platos</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Cart items OR Empty State + History */}
                    <div className="lg:col-span-8 space-y-12">
                        {cart.length === 0 ? (
                            <div className="bg-white rounded-[3rem] p-16 text-center shadow-2xl border border-gray-100">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4 font-serif">Tu lista está vacía</h2>
                                <p className="text-gray-500 mb-10 text-lg">
                                    Parece que aún no has agregado ningún plato.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-block bg-brand-red text-white px-12 py-5 rounded-full font-bold shadow-xl hover:bg-red-800 transition-all transform hover:scale-105"
                                >
                                    Ver Carta de Hoy
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100">
                                    <h2 className="text-2xl font-serif text-gray-800 mb-8 flex items-center gap-4">
                                        <span className="bg-brand-red/10 w-10 h-10 rounded-xl text-brand-red flex items-center justify-center font-bold text-lg">01</span>
                                        Detalle del Pedido Actual
                                    </h2>
                                    <div className="space-y-6">
                                        {cart.map((item) => (
                                            <div key={item.id} className="bg-gray-50/50 rounded-[1.5rem] p-6 flex items-center gap-8 group hover:bg-white hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-brand-red/10">
                                                <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-bold text-2xl text-gray-800 mb-2">{item.name}</h3>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-brand-red font-black text-xl">{item.priceFormatted}</span>
                                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                                        <span className="text-gray-500 font-bold bg-white px-4 py-1.5 rounded-xl border border-gray-100 text-sm shadow-sm tracking-tight">Cantidad: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all cursor-pointer group/del"
                                                    title="Eliminar plato"
                                                >
                                                    <Trash2 className="w-7 h-7 group-hover/del:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-gray-100 flex justify-between items-center">
                                        <button
                                            onClick={clearCart}
                                            className="text-gray-400 hover:text-red-600 font-black transition-colors cursor-pointer text-xs uppercase tracking-[0.2em]"
                                        >
                                            Vaciar mi lista
                                        </button>
                                        <p className="text-gray-400 font-medium text-sm">
                                            Subtotal ({cart.length} platos)
                                        </p>
                                    </div>
                                </div>

                            </div>
                        )}

                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif text-gray-800 flex items-center gap-4 px-4">
                                <span className="bg-gray-100 w-10 h-10 rounded-xl text-gray-400 flex items-center justify-center font-bold text-lg tracking-tighter">📜</span>
                                Historial de Pedidos Realizados
                            </h2>

                            {isLoadingHistory ? (
                                <div className="p-12 text-center text-gray-400">Cargando tu historial...</div>
                            ) : orderHistory.length === 0 ? (
                                <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
                                    <p className="text-gray-400 italic">Aún no tienes pedidos registrados en tu historial.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orderHistory.map((order) => (
                                        <div key={order.id} className="bg-white rounded-[2rem] p-8 shadow-md border border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-brand-red text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-tighter">Pedido #{order.id}</span>
                                                    <span className="text-gray-400 text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm font-medium mb-4">
                                                    {order.items.length} platos • <span className="text-gray-800 font-bold">{order.paymentMethod}</span>
                                                </p>
                                                <button
                                                    onClick={() => handleRepeatOrder(order)}
                                                    className="flex items-center gap-2 text-brand-red font-black text-[10px] uppercase tracking-widest hover:bg-brand-red/5 px-4 py-2 rounded-xl transition-all border border-brand-red/10 cursor-pointer"
                                                >
                                                    <RefreshCw className="w-3 h-3" /> Repetir esta compra
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-4 md:mt-0">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Total</p>
                                                    <p className="text-2xl font-black text-brand-red leading-none">S/ {Number(order.total).toFixed(2)}</p>
                                                </div>
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status === 'PENDIENTE' ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700'}`}>
                                                    {order.status === 'PENDIENTE' ? 'ENTREGADO' : order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Summary Box (Sticky) */}
                    {cart.length > 0 && (
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 sticky top-32">
                                <h2 className="text-2xl font-serif text-gray-800 mb-8">Resumen Actual</h2>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between text-gray-500 text-lg">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-gray-800">S/ {totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 text-lg">
                                        <span>Delivery</span>
                                        <span className="text-green-600 font-black tracking-tight uppercase text-sm">Por coordinar</span>
                                    </div>
                                    <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-gray-800 font-black text-xl uppercase tracking-tighter">Total a Pagar</span>
                                        <span className="text-4xl font-black text-brand-red tracking-tight shadow-brand-red/5">S/ {totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className="w-full bg-brand-red hover:bg-red-800 text-white font-black py-6 rounded-[1.5rem] transition-all duration-300 shadow-2xl flex flex-col items-center justify-center gap-1 text-xl cursor-pointer transform hover:scale-[1.03] active:scale-95 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" /> Ir a Pagar
                                    </div>
                                    <span className="text-[10px] opacity-70 uppercase tracking-[0.3em] font-black">Elegir detalles de pago</span>
                                </button>

                                <div className="mt-8 p-6 bg-brand-yellow/5 rounded-[1.5rem] border border-dashed border-brand-yellow/30">
                                    <p className="text-gray-500 text-xs text-center leading-relaxed">
                                        Al finalizar, te redirigiremos a WhatsApp para confirmar el pago mediante <strong className="text-brand-red">{paymentMethod}</strong>. ¡Gracias por elegirnos!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Detail Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-brand-red p-8 text-white relative">
                            <button
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="absolute right-6 top-6 hover:rotate-90 transition-transform cursor-pointer"
                            >
                                <Trash2 className="w-6 h-6 rotate-45" />
                            </button>
                            <h2 className="text-3xl font-serif mb-2">Detalle de Pago</h2>
                            <p className="opacity-80 text-sm uppercase tracking-widest font-bold">Método: {paymentMethod}</p>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Selecciona cómo deseas pagar</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {paymentOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setPaymentMethod(option.id)}
                                            className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${paymentMethod === option.id
                                                ? "border-brand-red bg-brand-red/5 text-brand-red"
                                                : "border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200"
                                                }`}
                                        >
                                            <span className="font-black text-[9px] uppercase tracking-tighter">{option.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-100"></div>
                            {(paymentMethod === "YAPE" || paymentMethod === "PLIN") && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Celular de la operación (Tuyo)</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: 999 000 000"
                                            value={paymentPhone}
                                            onChange={(e) => setPaymentPhone(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl focus:border-brand-red outline-none transition-all font-bold text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Código de aprobación</label>
                                        <input
                                            type="text"
                                            placeholder="Ingresa el código"
                                            value={approvalCode}
                                            onChange={(e) => setApprovalCode(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl focus:border-brand-red outline-none transition-all font-bold text-lg"
                                        />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "TARJETA" && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Número de Tarjeta</label>
                                        <input
                                            type="text"
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl focus:border-brand-red outline-none transition-all font-bold text-lg"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Vencimiento</label>
                                            <input
                                                type="text"
                                                placeholder="MM/AA"
                                                className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl focus:border-brand-red outline-none transition-all font-bold text-lg"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">CVV</label>
                                            <input
                                                type="password"
                                                placeholder="***"
                                                className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl focus:border-brand-red outline-none transition-all font-bold text-lg"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {paymentMethod === "EFECTIVO" && (
                                <div className="bg-yellow-50 p-8 rounded-[2rem] border border-yellow-200 text-center">
                                    <span className="text-5xl mb-4 block">💰</span>
                                    <p className="text-yellow-800 font-bold mb-2">Pago contra entrega</p>
                                    <p className="text-xs text-yellow-700 leading-relaxed text-center mx-auto">
                                        Pagará su pedido al recibirlo. Por favor, tenga el monto exacto de <strong className="font-black text-brand-red">S/ {totalPrice.toFixed(2)}</strong> para agilizar la entrega.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleFinalOrder}
                                disabled={isProcessing}
                                className="w-full bg-brand-red hover:bg-red-800 text-white font-black py-6 rounded-[1.5rem] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 text-xl cursor-pointer disabled:opacity-50"
                            >
                                {isProcessing ? "Procesando..." : <><MessageCircle className="w-6 h-6" /> Confirmar y Pedir</>}
                            </button>

                            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-black pt-4">
                                Seguridad encriptada SSL
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
