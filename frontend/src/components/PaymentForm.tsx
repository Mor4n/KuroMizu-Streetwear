import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';

export default function PaymentForm({ clientSecret, orderId }: { clientSecret: string, orderId: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const { clearCart } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage('');

        // Confirmar el pago
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Redirección x pago exitoso
                return_url: `${window.location.origin}/checkout/success?order=${orderId}`,
            },
        });

        if (error) {
            setErrorMessage(error.message || 'Ocurrió un error inesperado al procesar el pago.');
            setIsProcessing(false);
        } else {
            // El pago fue exitoso y el usuario será redirigido por Stripe , se limpia el carro
            clearCart();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 border-2 border-gray-200">
                <PaymentElement />
            </div>

            {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm font-bold">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-black text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors border-2 border-black hover:border-transparent disabled:opacity-50 cursor-pointer"
            >
                {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
            </button>
        </form>
    );
}
