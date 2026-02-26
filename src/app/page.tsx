"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { X, CheckCircle, MessageCircle, ShoppingBag } from "lucide-react";

interface Dish {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  longDescription: string;
  image: string;
  includes: string[];
}

export default function Home() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);

  const [heroContent, setHeroContent] = useState({
    home_hero_title: "Sabor Limeño",
    home_hero_subtitle: "Comida criolla peruana con el auténtico sabor casero que te hace sentir en familia."
  });

  useState(() => {
    fetch("/api/admin/content?prefix=home_hero")
      .then(res => res.json())
      .then(data => {
        if (data.home_hero_title) {
          setHeroContent({
            home_hero_title: data.home_hero_title,
            home_hero_subtitle: data.home_hero_subtitle || ""
          });
        }
      });
  });

  const featuredDishes: Dish[] = [
    {
      id: "lomo-saltado",
      name: "Lomo Saltado",
      price: 35.0,
      priceFormatted: "S/ 35.00",
      description: "Trozo de carne de res salteada al wok con cebolla, tomate y papas fritas.",
      longDescription: "Nuestro plato bandera preparado con la técnica tradicional del flambeado al wok, logrando ese sabor ahumado característico que solo Sabor Limeño puede ofrecer.",
      image: "/images/loo.png",
      includes: ["Arroz blanco graneado", "Papas fritas amarillas", "Carne de res seleccionada", "Cebolla y tomate fresco", "Culantro y cebollita china"]
    },
    {
      id: "aji-gallina",
      name: "Ají de Gallina",
      price: 28.0,
      priceFormatted: "S/ 28.00",
      description: "Crema de ají amarillo con pollo deshilachado, servido con arroz y papas.",
      longDescription: "Una receta de casa, cremosa y con el picante justo del ají amarillo seleccionado. Preparado con leche, nueces y el secreto mejor guardado de nuestra cocina.",
      image: "/images/aji.png",
      includes: ["Arroz blanco", "Papas sancochadas", "Huevo duro", "Aceituna botija", "Crema de ají amarillo artesanal"]
    },
    {
      id: "anticuchos",
      name: "Anticuchos",
      price: 25.0,
      priceFormatted: "S/ 25.00",
      description: "Corazón de res marinado en ají panca y parrillado al carbón.",
      longDescription: "Dos palitos de corazón de res tiernos, marinados por 24 horas en nuestra mezcla secreta de ají panca y especias, cocidos a la perfección sobre brasas de carbón.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
      includes: ["2 Palitos de anticucho", "Papa dorada", "Choclo tierno", "Ají de pollería especial"]
    },
    {
      id: "picarones",
      name: "Picarones",
      price: 1.0,
      priceFormatted: "S/ 1.00",
      description: "Aros crujientes de camote y zapallo bañados en miel de chancaca.",
      longDescription: "El postre tradicional limeño por excelencia. Aros calientes y crocantes hechos de una masa especial de zapallo macre y camote, bañados generosamente en miel de chancaca.",
      image: "/images/picarones.png",
      includes: ["4 Aros de picarones", "Miel de chancaca artesanal", "Toque de hoja de higo", "Canela y clavo de olor"]
    }
  ];

  const handleOpenDetail = (dish: Dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
    setAddedMessage(false);
  };

  const handleAddToCart = (dish: Dish) => {
    if (!user) {
      router.push("/login");
      return;
    }

    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      priceFormatted: dish.priceFormatted,
      image: dish.image
    });

    setAddedMessage(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setAddedMessage(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banner.png"
            alt="Comida criolla peruana - Sabor Limeño"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.35] scale-105"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-brand-yellow text-lg uppercase tracking-[0.3em] font-bold mb-4 block drop-shadow-md">
            Tradición en cada bocado
          </span>
          <h1 className="font-serif text-6xl md:text-8xl text-white mb-6 drop-shadow-2xl text-center">
            {heroContent.home_hero_title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-12 max-w-2xl mx-auto drop-shadow-lg italic text-center">
            "{heroContent.home_hero_subtitle}"
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/carta"
              className="bg-brand-red hover:bg-red-900 text-white font-bold py-5 px-10 rounded-full transition-all transform hover:scale-105 shadow-2xl text-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-6 h-6" />
              Ver Nuestra Carta
            </Link>
            <button
              onClick={() => {
                const text = "Hola 😊 estoy visitando su página web y quisiera consultar la carta disponible para hoy";
                window.open(`https://wa.me/51984256122?text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-brand-red font-bold py-5 px-10 rounded-full transition-all text-lg cursor-pointer"
            >
              Consultar WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/aji.png"
              alt="Nuestra cocina"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-4xl text-brand-red mb-6">Nuestra Pasión por lo Nuestro</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              En **Sabor Limeño**, no solo servimos platos, entregamos memorias. Cada ingrediente es seleccionado cuidadosamente para recrear esas tardes de domingo en casa de la abuela.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Desde nuestro Lomo Saltado salteado al fuego vivo hasta nuestra Chicha Morada hecha con maíz de verdad, aquí la tradición se respeta y se celebra.
            </p>
            <Link href="/nosotros" className="text-brand-red font-bold text-xl hover:underline flex items-center gap-2">
              Conoce nuestra historia &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Platos Destacados */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-brand-red mb-12">
            Platos Destacados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDishes.map((dish, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="font-bold text-xl text-brand-red mb-2">{dish.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {dish.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="text-lg font-bold text-brand-yellow">{dish.price}</span>
                    <button
                      onClick={() => handleOpenDetail(dish)}
                      className="text-brand-red text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-all cursor-pointer border border-brand-red/10"
                    >
                      Pedir ahora
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/carta"
              className="inline-block border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-bold py-3 px-8 rounded-full transition-all"
            >
              Ver carta completa
            </Link>
          </div>
        </div>
      </section>

      {/* Dish Detail Modal */}
      {isModalOpen && selectedDish && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full text-gray-800 hover:bg-brand-red hover:text-white transition-all shadow-md cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Image */}
            <div className="relative w-full md:w-1/2 min-h-[300px] md:h-auto">
              <Image
                src={selectedDish.image}
                alt={selectedDish.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white md:hidden">
                <h2 className="text-3xl font-serif font-bold">{selectedDish.name}</h2>
                <p className="text-brand-yellow text-xl font-bold">{selectedDish.price}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
              <div className="hidden md:block mb-6">
                <h2 className="text-4xl font-serif text-brand-red font-bold mb-2">{selectedDish.name}</h2>
                <span className="text-2xl font-bold text-brand-yellow bg-brand-yellow/10 px-4 py-1 rounded-full">{selectedDish.price}</span>
              </div>

              <div className="mb-8">
                <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {selectedDish.longDescription}
                </p>
              </div>

              <div className="mb-8 flex-grow">
                <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4">¿Qué lleva este plato?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedDish.includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(selectedDish)}
                disabled={addedMessage}
                className={`w-full font-bold py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-lg cursor-pointer transform hover:scale-[1.02] ${addedMessage ? 'bg-green-500 text-white' : 'bg-brand-red hover:bg-red-900 text-white'
                  }`}
              >
                {addedMessage ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    ¡Plato Agregado!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-6 h-6" />
                    Agregar a mis pedidos
                  </>
                )}
              </button>
              <p className="text-center text-gray-400 text-xs mt-4 italic">
                {addedMessage ? "Podrás ver tu pedido en el menú superior" : "Se añadirá a tu lista de platos seleccionados"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <section className="py-20 px-4 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-brand-red mb-12">
            Opiniones de Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "La mejor comida criolla que he probado en Lima. ¡El Lomo Saltado es increíble!", author: "María R." },
              { text: "Atención rápida y sabor realmente casero. Muy recomendado.", author: "Juan P." },
              { text: "Excelente relación calidad-precio. Los picarones cierran la comida con broche de oro.", author: "Elena G." }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-center italic">
                <p className="text-gray-700 mb-6">"{review.text}"</p>
                <span className="font-bold text-brand-red not-italic">— {review.author}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-4xl text-brand-red mb-6">
              ¡Visítanos!
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Estamos ubicados en el corazón de la ciudad, listos para brindarte la mejor experiencia culinaria criolla.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <span className="text-brand-yellow font-bold text-xl">📍</span>
                Av. Principal 123, Lima, Perú
              </li>
              <li className="flex items-center gap-3">
                <span className="text-brand-yellow font-bold text-xl">📞</span>
                +51 984 256 122
              </li>
              <li className="flex items-center gap-3">
                <span className="text-brand-yellow font-bold text-xl">⏰</span>
                Lun - Dom: 12:00 PM - 10:00 PM
              </li>
            </ul>
          </div>
          <div className="h-[400px] bg-gray-200 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15605.82390776116!2d-77.0365256!3d-12.0863032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8668798544b%3A0x6bba3bc7a61d1136!2sLima!5e0!3m2!1ses!2spe!4v1708781234567!5m2!1ses!2spe"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-brand-red py-12 text-center text-white">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-2xl font-serif mb-4">Sabor Limeño</p>
          <p className="text-brand-yellow-light text-sm mb-8">Comida criolla peruana con sabor casero</p>
          <div className="border-t border-red-900 pt-8 mt-8 text-xs text-red-200">
            &copy; {new Date().getFullYear()} Restaurante Sabor Limeño. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
