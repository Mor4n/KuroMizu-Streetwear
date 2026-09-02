import Stripe from 'stripe';
import { supabase } from '../config/supabase.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Error validando firma del webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar cuando el pago se aprueba y se cobra
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.order_id;

    console.log(`Pago procesado exitosamente para la orden <3 : ${orderId}`);

    if (orderId) {
      try {
        // 1. Cambiar status de la orden a 'paid'
        const { error: orderError } = await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId);

        if (orderError) throw orderError;

        // 2. Obtener los artículos comprados
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        // 3. Descontar el stock de product_sizes
        for (const item of orderItems) {
          // Buscamos cuánto stock tiene actualmente
          const { data: currentSize, error: sizeError } = await supabase
            .from('product_sizes')
            .select('stock')
            .eq('id_product', item.product_id)
            .eq('size', item.size)
            .single();

          if (sizeError || !currentSize) {
            console.error(`Error al buscar stock para el producto ${item.product_id} - talla ${item.size}`);
            console.error('Supabase Error:', sizeError);
            continue;
          }

          const newStock = Math.max(0, currentSize.stock - item.quantity); // Nunca bajar de 0

          // Actualizar stock
          await supabase
            .from('product_sizes')
            .update({ stock: newStock })
            .eq('id_product', item.product_id)
            .eq('size', item.size);

          console.log(`Stock actualizado para ${item.product_id} (Talla: ${item.size}): Quedan ${newStock}!`);
        }
      } catch (err) {
        console.error('Error al actualizar base de datos tras pago exitoso:', err);
        // Deovlver 500 para que Stripee vuelva a intentar mandar el webhook después
        return res.status(500).end();
      }
    }
  }

  // Retornar un 200 para decirle a strippe que recibimos el mensaje bien
  res.json({ received: true });
};
