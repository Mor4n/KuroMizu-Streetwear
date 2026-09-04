import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

interface ProductSize {
  id?: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image_urls: string[];
  product_sizes: ProductSize[];
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

export default function ProductFormModal({ isOpen, onClose, product, onSuccess }: ProductFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [category, setCategory] = useState('Playeras');
  const [imageUrls, setImageUrls] = useState('');
  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([
    { size: 'S', stock: 0 },
    { size: 'M', stock: 0 },
    { size: 'L', stock: 0 },
    { size: 'XL', stock: 0 }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price || '');
      setCategory(product.category || 'Playeras');
      setImageUrls(product.image_urls ? product.image_urls.join(', ') : '');

      const defaultSizes = ['S', 'M', 'L', 'XL'];
      const mappedSizes = defaultSizes.map(sizeName => {
        const found = product.product_sizes?.find(s => s.size === sizeName);
        return { size: sizeName, stock: found ? Number(found.stock) : 0 };
      });
      setSizes(mappedSizes);
    } else {
      // Limpiar formulario 
      setName('');
      setDescription('');
      setPrice('');
      setCategory('Playeras');
      setImageUrls('');
      setSizes([
        { size: 'S', stock: 0 },
        { size: 'M', stock: 0 },
        { size: 'L', stock: 0 },
        { size: 'XL', stock: 0 }
      ]);
    }
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSizeChange = (sizeName: string, newStock: number) => {
    setSizes(sizes.map(s => s.size === sizeName ? { ...s, stock: newStock } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const urlsArray = imageUrls.split(',').map(url => url.trim()).filter(url => url !== '');

      const filteredSizes = sizes.filter(s => s.stock > 0);

      const payload = {
        name,
        description,
        price: Number(price),
        category,
        image_urls: urlsArray,
        sizes: filteredSizes
      };

      if (product) {
        // Actualizar
        await api.put(`/products/${product.id}`, payload);
      } else {
        // Crear
        await api.post('/products', payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center z-10">
          <h2 className="text-lg font-bold uppercase tracking-wider">
            {product ? 'Editar Producto' : 'Crear Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 text-sm font-bold border border-red-200 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
                  placeholder="Ej. Chaqueta FMAB"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Categoría</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent cursor-pointer"
                >
                  <option value="Playeras">Playeras</option>
                  <option value="Sudaderas">Sudaderas</option>
                  <option value="Abrigos">Abrigos</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Precio (MXN)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
                  placeholder="1250.00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Descripción</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors text-sm"
                  placeholder="Detalles sobre la tela, el diseño..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">URLs de las Imágenes</label>
                <textarea
                  rows={2}
                  value={imageUrls}
                  onChange={e => setImageUrls(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-sm"
                  placeholder="https://imgur.com/foto1.jpg, https://imgur.com/foto2.jpg (Separadas por comas)"
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700 mb-4 border-b border-gray-200 pb-2">Inventario por Talla</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sizes.map(s => (
                  <div key={s.size} className="bg-gray-50 border border-gray-200 p-4 text-center">
                    <label className="block text-lg font-bold mb-2">{s.size}</label>
                    <input
                      type="number"
                      min="0"
                      value={s.stock}
                      onChange={e => handleSizeChange(s.size, parseInt(e.target.value) || 0)}
                      className="w-full text-center border-b border-gray-300 bg-transparent focus:outline-none focus:border-black font-mono text-lg"
                    />
                    <div className="text-[10px] text-gray-400 uppercase mt-2 font-bold tracking-wider">Unidades</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
