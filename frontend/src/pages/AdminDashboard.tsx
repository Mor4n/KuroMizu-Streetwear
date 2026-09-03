import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminProducts from '../components/admin/AdminProducts';

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
  shipping_name: string;
  shipping_email: string;
  shipping_city: string;
  order_items: OrderItem[];
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setStatusUpdating(orderId);
      await api.patch(`/orders/${orderId}`, { status: newStatus });

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar el estado');
    } finally {
      setStatusUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'paid': return 'text-green-600';
      case 'shipped': return 'text-blue-600';
      case 'delivered': return 'text-purple-600';
      case 'canceled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'paid': return 'Pagado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'canceled': return 'Cancelado';
      default: return status;
    }
  };

  const renderOrdersTable = () => {
    if (loading) {
      return (
        <div className="py-20 flex justify-center">
          <div className="text-sm font-bold tracking-widest uppercase animate-pulse">Cargando Órdenes...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 text-red-600 p-4 border border-red-200">
          {error}
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 border border-gray-200 bg-white">
          No hay órdenes registradas aún.
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">ID Orden / Fecha</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Artículos</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-mono text-xs text-gray-500 mb-1">
                    {order.id}
                  </div>
                  <div className="font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-black">{order.shipping_name}</div>
                  <div className="text-gray-500">{order.shipping_email}</div>
                  <div className="text-xs text-gray-400 mt-1">{order.shipping_city}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {order.order_items.map(item => (
                      <div key={item.id} className="flex items-center gap-2">
                        {item.products?.image_urls?.[0] && (
                          <img
                            src={item.products.image_urls[0]}
                            alt={item.products.name}
                            className="w-14 h-14 object-cover border border-gray-200 rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium text-xs truncate max-w-[150px]">
                            {item.products?.name || 'Producto Eliminado'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.quantity}x Talla {item.size}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold">
                  ${order.total_amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={statusUpdating === order.id}
                    className="text-xs border border-gray-300 p-2 uppercase tracking-wider cursor-pointer bg-white disabled:opacity-50"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="canceled">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <h1 className="text-2xl font-display uppercase tracking-wider mb-8">Admin</h1>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`text-left px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors border-l-2 ${
              activeTab === 'orders' 
                ? 'border-black bg-gray-50 text-black' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-black'
            }`}
          >
            Órdenes
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`text-left px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors border-l-2 ${
              activeTab === 'products' 
                ? 'border-black bg-gray-50 text-black' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-black'
            }`}
          >
            Productos
          </button>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-grow">
        <h2 className="text-xl font-bold tracking-wider uppercase mb-6">
          {activeTab === 'orders' ? 'Gestión de Órdenes' : 'Catálogo de Productos'}
        </h2>
        
        {activeTab === 'orders' && renderOrdersTable()}
        {activeTab === 'products' && <AdminProducts />}
      </main>
    </div>
  );
}
