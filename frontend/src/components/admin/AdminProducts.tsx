import { useEffect, useState } from 'react';
import api from '../../api/axios';
import ProductFormModal from './ProductFormModal';

interface ProductSize {
  id: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  is_active: boolean;
  image_urls: string[];
  product_sizes: ProductSize[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products?include_archived=true');
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas archivar este producto? Desaparecerá de la tienda.')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al archivar el producto');
    }
  };

  const handleUnarchive = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas volver a publicar este producto?')) return;
    try {
      await api.patch(`/products/${id}/unarchive`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al desarchivar el producto');
    }
  };

  const handleHardDelete = async (id: string) => {
    if (!window.confirm('OJITO, ¿Seguro que deseas ELIMINAR PERMANENTEMENTE este producto? Esta acción no se puede deshacer.')) return;
    try {
      await api.delete(`/products/${id}/hard`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar el producto de forma permanente.');
    }
  };

  const getTotalStock = (sizes: ProductSize[]) => {
    if (!sizes || sizes.length === 0) return 0;
    return sizes.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="text-sm font-bold tracking-widest uppercase animate-pulse">Cargando Productos...</div>
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">
          Gestiona el catálogo de la tienda. Puedes ocultar productos agotados o crear nuevos.
        </p>
        <button
          onClick={handleCreate}
          className="bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Inventario Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!product.is_active ? 'opacity-50 bg-gray-50' : ''}`}>
                  <td className="px-6 py-4 flex items-center gap-4">
                    {product.image_urls?.[0] ? (
                      <img
                        src={product.image_urls[0]}
                        alt={product.name}
                        className="w-14 h-14 object-cover border border-gray-200 rounded"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 border border-gray-300 rounded"></div>
                    )}
                    <div className="font-medium max-w-[200px] truncate">{product.name}</div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 font-bold">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold">{getTotalStock(product.product_sizes)} unidades</div>
                    <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
                      {product.product_sizes?.map(s => (
                        <span key={s.id} className="bg-gray-100 border border-gray-200 px-2 py-1 rounded-sm font-mono flex items-center gap-1">
                          <span className="font-bold">{s.size}</span>
                          <span className="text-gray-400">|</span>
                          <span>{s.stock}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest ${product.is_active
                        ? 'text-green-600'
                        : 'text-gray-500'
                      }`}>
                      {product.is_active ? 'Activo' : 'Archivado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Editar
                      </button>
                      {product.is_active ? (
                        <button
                          onClick={() => handleArchive(product.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Archivar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnarchive(product.id)}
                          className="text-green-600 hover:text-green-800 font-bold text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Desarchivar
                        </button>
                      )}
                      <button
                        onClick={() => handleHardDelete(product.id)}
                        className="text-red-900 hover:text-red-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
