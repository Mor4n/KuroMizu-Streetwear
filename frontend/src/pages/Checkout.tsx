import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
    const { items, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        city: '',
        zip: '',
    });

    // Si el carrito está vacío, no deberíamos estar aquí >:l
    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
                <h1 className="font-display text-4xl uppercase tracking-wider mb-6">Checkout</h1>
                <p className="text-gray-500 mb-8 tracking-widest uppercase text-sm">No tienes artículos en tu bolsa.</p>
                <Link to="/">
                    <button className="bg-black text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors border-2 border-black hover:border-transparent">
                        Regresar a la tienda
                    </button>
                </Link>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProceedToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Llamar ahorita al backend para crear el try de pago con Stripe
        console.log("Procediendo al pago con los datos:", formData);

    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
            <h1 className="font-display text-4xl uppercase tracking-wider mb-12">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                {/* Lado Izquierdo doned está el Formulario de Envío */}
                <div className="w-full lg:w-3/5">
                    <h2 className="text-xl font-bold tracking-widest uppercase mb-6 border-b border-gray-200 pb-4">1. Datos de Envío</h2>

                    <form id="shipping-form" onSubmit={handleProceedToPayment} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 p-3 focus:border-black focus:outline-none transition-colors rounded-none"
                                    placeholder="Adriana"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 p-3 focus:border-black focus:outline-none transition-colors rounded-none"
                                    placeholder="adriana@kuromizu.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2">Dirección de envío</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-200 p-3 focus:border-black focus:outline-none transition-colors rounded-none"
                                placeholder="Calle y número exterior / interior"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Ciudad</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 p-3 focus:border-black focus:outline-none transition-colors rounded-none"
                                    placeholder="Agua Prieta"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Código Postal</label>
                                <input
                                    type="text"
                                    name="zip"
                                    required
                                    value={formData.zip}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 p-3 focus:border-black focus:outline-none transition-colors rounded-none"
                                    placeholder="84200"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Lado Derecho donde está la Orden */}
                <div className="w-full lg:w-2/5">
                    <div className="bg-[#f5f5f5] p-8 border border-gray-200">
                        <h2 className="text-xl font-bold tracking-widest uppercase mb-6 border-b border-gray-300 pb-4">Resumen</h2>

                        <div className="space-y-4 mb-6 overflow-y-auto max-h-[40vh] pr-2">
                            {items.map(item => (
                                <div key={`${item.id}-${item.size}`} className="flex justify-between items-start gap-4">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-20 bg-white border border-gray-200 flex-shrink-0">
                                            {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm uppercase leading-tight max-w-[150px]">{item.name}</h3>
                                            <p className="text-xs text-gray-500 uppercase mt-1">Talla: {item.size}</p>
                                            <p className="text-xs text-gray-500 uppercase">Cant: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-300 pt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="uppercase text-gray-500">Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="uppercase text-gray-500">Envío</span>
                                <span className="font-bold">GRATIS</span>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-300 pt-4 mt-4">
                                <span className="font-bold uppercase tracking-wider">Total</span>
                                <span className="font-display text-2xl font-bold">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="shipping-form"
                            className="w-full bg-black text-white py-4 mt-8 text-sm font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors border-2 border-black hover:border-transparent cursor-pointer"
                        >
                            Continuar al Pago
                        </button>

                        <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider mt-4">
                            Pagos seguros encriptados
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
