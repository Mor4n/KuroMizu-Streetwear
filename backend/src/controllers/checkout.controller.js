import Stripe from 'stripe';
import { supabase } from '../config/supabase.js';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { items, shippingData, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }

    // 1. Calcular total 
    const amountToCharge = items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    const amountInCents = Math.round(amountToCharge * 100);

    // 2. Crear la orden en la base de datos con status 'pending'
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId || null, // Si es invitado será null
          total_amount: amountToCharge,
          shipping_name: shippingData.name,
          shipping_email: shippingData.email,
          shipping_address: shippingData.address,
          shipping_city: shippingData.city,
          shipping_zip: shippingData.zip,
          status: 'pending',
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Crear order_items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      size: item.size,
      quantity: item.quantity,
      price_at_time: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 4. Crear PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'mxn',
      metadata: {
        order_id: order.id,
      },
    });

    // 5. Actualizar orden ID de Stripe
    await supabase
      .from('orders')
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq('id', order.id);

    // 6. Regreso el client_secret al frontend para que pueda cobrar
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    });

  } catch (error) {
    console.error('Error creando el intent de pago:', error);
    res.status(500).json({ error: 'Hubo un error procesando el pago.' });
  }
};
