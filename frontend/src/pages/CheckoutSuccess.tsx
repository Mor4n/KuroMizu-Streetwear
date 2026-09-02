import { Link, useSearchParams } from 'react-router-dom';

export default function CheckoutSuccess() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order');

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
            <svg className="w-24 h-24 text-green-500 mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <h1 className="font-display text-4xl uppercase tracking-wider mb-4">¡Pago Exitoso!</h1>
            <p className="text-gray-500 mb-2 tracking-widest uppercase text-sm">Tu orden ha sido procesada correctamente.</p>
            
            {orderId && (
                <p className="font-bold mb-8">Orden #{orderId.substring(0, 8).toUpperCase()}</p>
            )}

            <Link to="/">
                <button className="bg-black text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors border-2 border-black hover:border-transparent mt-8 cursor-pointer">
                    Seguir Comprando
                </button>
            </Link>
        </div>
    );
}
