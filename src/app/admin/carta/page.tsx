"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Edit2, Trash2, Save, X, Upload, CheckCircle2, AlertCircle } from "lucide-react";

interface Dish {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available: boolean;
}

export default function AdminCartaPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDish, setEditingDish] = useState<Dish | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Entradas",
        image: "",
        available: true
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "ADMIN")) {
            router.push("/");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const res = await fetch("/api/dishes");
            const data = await res.json();
            if (res.ok) setDishes(data);
        } catch (err) {
            setError("Error al cargar la carta");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: data
            });
            const result = await res.json();
            if (res.ok) {
                setFormData({ ...formData, image: result.url });
                setSuccess("¡Imagen subida correctamente!");
            } else {
                setError(result.error || "Error al subir imagen");
            }
        } catch (err) {
            setError("Error al subir imagen");
        } finally {
            setUploading(false);
            setTimeout(() => setSuccess(""), 3000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const method = editingDish ? "PUT" : "POST";
        const payload = editingDish ? { ...formData, id: editingDish.id } : formData;

        try {
            const res = await fetch("/api/admin/dishes", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccess(editingDish ? "Plato actualizado" : "Plato agregado");
                setIsModalOpen(false);
                setEditingDish(null);
                setFormData({ name: "", description: "", price: "", category: "Entradas", image: "", available: true });
                fetchDishes();
            } else {
                const data = await res.json();
                setError(data.error || "Error al guardar");
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setTimeout(() => setSuccess(""), 3000);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este plato?")) return;

        try {
            const res = await fetch(`/api/admin/dishes?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setSuccess("Plato eliminado");
                fetchDishes();
            }
        } catch (err) {
            setError("Error al eliminar");
        } finally {
            setTimeout(() => setSuccess(""), 3000);
        }
    };

    const openEditModal = (dish: Dish) => {
        setEditingDish(dish);
        setFormData({
            name: dish.name,
            description: dish.description,
            price: dish.price.toString(),
            category: dish.category,
            image: dish.image,
            available: dish.available
        });
        setIsModalOpen(true);
    };

    if (authLoading || isLoading) {
        return <div className="min-h-screen flex items-center justify-center pt-24">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Administrar Carta</h1>
                        <p className="text-gray-600">Agrega, edita o elimina platos de la carta de Sabor Limeño.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingDish(null);
                            setFormData({ name: "", description: "", price: "", category: "Entradas", image: "", available: true });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-brand-red text-white px-6 py-3 rounded-xl font-bold hover:bg-red-800 transition-all shadow-lg cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        Agregar Nuevo Plato
                    </button>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl flex items-center gap-3 animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <p className="text-green-700 font-medium">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dishes.map((dish) => (
                        <div key={dish.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
                            <div className="relative h-48 w-full group-hover:scale-105 transition-transform duration-500">
                                <Image
                                    src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"}
                                    alt={dish.name}
                                    fill
                                    className="object-cover"
                                />
                                {!dish.available && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Agotado</span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-brand-red text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                        {dish.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-red transition-colors">{dish.name}</h3>
                                    <span className="text-lg font-bold text-brand-red">S/ {Number(dish.price).toFixed(2)}</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">{dish.description}</p>

                                <div className="flex gap-2 pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => openEditModal(dish)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-bold text-sm cursor-pointer"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dish.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100 transition-colors font-bold text-sm cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Plato */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-scale-in">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-all z-10 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col md:flex-row h-full">
                            {/* Left: Image Upload Preview */}
                            <div className="w-full md:w-5/12 bg-gray-100 relative min-h-[250px] flex flex-col items-center justify-center p-8 text-center">
                                {formData.image ? (
                                    <>
                                        <Image
                                            src={formData.image}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                            <label className="bg-white/90 text-gray-800 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-white flex items-center gap-2 border shadow-lg">
                                                <Upload className="w-4 h-4" />
                                                Cambiar Foto
                                                <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center gap-4 cursor-pointer group">
                                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8 text-gray-300 group-hover:text-brand-red transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-gray-800 font-bold text-sm">Sube la foto del plato</p>
                                            <p className="text-gray-400 text-xs mt-1">PNG, JPG hasta 5MB</p>
                                        </div>
                                        <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" />
                                    </label>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-3">
                                        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-brand-red font-bold text-xs uppercase tracking-widest">Subiendo...</p>
                                    </div>
                                )}
                            </div>

                            {/* Right: Form */}
                            <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col max-h-[85vh] overflow-y-auto">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                                    {editingDish ? "Editar Plato" : "Nuevo Plato"}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre del Plato</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all placeholder:text-gray-300"
                                            placeholder="Ej: Lomo Saltado"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Precio (S/)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Categoría</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all cursor-pointer"
                                            >
                                                <option>Entradas</option>
                                                <option>Platos de Fondo</option>
                                                <option>Postres</option>
                                                <option>Bebidas</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción</label>
                                        <textarea
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none placeholder:text-gray-300"
                                            placeholder="Detalles sobre los ingredientes o preparación..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.available}
                                                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                        <span className="text-sm font-bold text-gray-700">Plato Disponible</span>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-brand-red hover:bg-red-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
                                    >
                                        <Save className="w-5 h-5" />
                                        {editingDish ? "Guardar Cambios" : "Crear Plato"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
