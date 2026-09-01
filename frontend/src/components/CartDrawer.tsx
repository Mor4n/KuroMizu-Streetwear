import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
    const { 
        items, 
        isCartOpen, 
        setIsCartOpen, 
        cartTotal, 
        removeFromCart, 
        updateQuantity 
    } = useCart();

    return (
        <>
            {/* Fondo oscuro (Overlay) */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                    isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Panel lateral del carrito */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isCartOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header del carrito */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="font-display text-2xl uppercase tracking-wider">Tu Bolsa</h2>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-400 hover:text-black transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido del carrito */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                            <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-sm tracking-widest uppercase">Tu bolsa está vacía</p>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 border-b border-black text-black font-semibold text-sm hover:text-gray-600 transition-colors"
                            >
                                SEGUIR COMPRANDO
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                    {/* Imagen del producto */}
                                    <div className="w-24 h-32 bg-gray-50 flex-shrink-0">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin img</div>
                                        )}
                                    </div>

                                    {/* Detalles del producto */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-sm uppercase tracking-wide pr-4 leading-tight">{item.name}</h3>
                                                <button 
                                                    onClick={() => removeFromCart(item.id, item.size)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 uppercase">Talla: {item.size}</p>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            {/* Controles de cantidad */}
                                            <div className="flex items-center border border-gray-200">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                    className="px-3 py-1 hover:bg-gray-50 transition-colors"
                                                >-</button>
                                                <span className="px-3 py-1 text-sm font-medium border-x border-gray-200 min-w-[2.5rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                    className="px-3 py-1 hover:bg-gray-50 transition-colors"
                                                >+</button>
                                            </div>
                                            <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer del carrito (Subtotal y Checkout) */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-6 bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold uppercase tracking-wider text-sm">Subtotal</span>
                            <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-6 text-center">Los impuestos y el envío se calculan en el checkout.</p>
                        
                        <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                            <button className="w-full bg-black text-white py-4 text-sm font-bold tracking-widest hover:bg-gray-900 transition-colors uppercase border-2 border-black hover:border-transparent">
                                PROCEDER AL PAGO
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
