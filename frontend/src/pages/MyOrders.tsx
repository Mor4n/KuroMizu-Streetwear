import React, { useEffect, useState } from 'react';
import api from '../api/axios';

interface OrderItem {
  id: string;
  size: string;
  quantity: number;
  price_at_time: number;
  products: {
    name: string;
    image_urls: string[];
  };
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled';
  order_items: OrderItem[];
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/my-orders');
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="text-yellow-600 px-3 py-1 text-xs font-bold uppercase tracking-widest">Pendiente</span>;
      case 'paid':
        return <span className="text-green-600 px-3 py-1 text-xs font-bold uppercase tracking-widest">Pagado</span>;
      case 'shipped':
        return <span className="text-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-widest">Enviado</span>;
      case 'delivered':
        return <span className="text-purple-600 px-3 py-1 text-xs font-bold uppercase tracking-widest">Entregado</span>;
      case 'canceled':
        return <span className="text-red-600 px-3 py-1 text-xs font-bold uppercase tracking-widest">Cancelado</span>;
      default:
        return <span className="text-gray-600 px-3 py-1 text-xs font-bold uppercase tracking-widest">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
        <div className="text-sm font-bold tracking-widest uppercase animate-pulse">Cargando tus pedidos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display uppercase tracking-wider mb-8 text-center md:text-left">
        Mis Pedidos
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 text-sm font-bold border border-red-200 mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div className="text-center py-20 bg-gray-50 border border-gray-200">
          <p className="text-gray-500 font-medium mb-4">Aún no has realizado ninguna compra.</p>
          <a href="/" className="inline-block px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors">
            Ir a la tienda
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Header de la tarjeta */}
              <div className="bg-gray-50 border-b border-gray-200 p-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-mono mb-1">Orden #{order.id.slice(0, 8)}</div>
                  <div className="font-bold text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  {getStatusBadge(order.status)}
                  <div className="font-bold text-lg mt-1">${order.total_amount.toFixed(2)} MXN</div>
                </div>
              </div>

              {/* Lista productos */}
              <div className="p-4 sm:px-6 divide-y divide-gray-100">
                {order.order_items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    {item.products?.image_urls?.[0] ? (
                      <img
                        src={item.products.image_urls[0]}
                        alt={item.products.name}
                        className="w-20 h-20 object-cover border border-gray-200 rounded-sm flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-sm flex-shrink-0" />
                    )}

                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{item.products?.name || 'Producto no disponible'}</h3>
                      <div className="text-sm text-gray-500 mt-1 flex gap-3">
                        <span>Talla: <strong className="text-gray-700">{item.size}</strong></span>
                        <span>Cant: <strong className="text-gray-700">{item.quantity}</strong></span>
                      </div>
                    </div>
                    <div className="font-bold whitespace-nowrap hidden sm:block">
                      ${(item.price_at_time * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
