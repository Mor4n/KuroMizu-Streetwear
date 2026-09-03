import { supabase } from '../config/supabase.js';

export const getAllOrders = async (req, res) => {
  try {
    // Obtener todas las órdenes
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_urls
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error al obtener las órdenes', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'paid', 'shipped', 'delivered', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error al actualizar la orden', error: error.message });
  }
};
