import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['Todo', 'Camisas', 'Abrigos', 'Hoodies', 'Accesorios'];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todo');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Construcción de query si hay una categoría seleccionada
                const url = selectedCategory === 'Todo'
                    ? '/products'
                    : `/products?category=${selectedCategory}`;

                const { data } = await api.get(url);
                setProducts(data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    return (
        <div id="productos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Hero Banner q dice "para ti"*/}
            <div className="mb-12 text-center sm:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 uppercase">
                    <span className="text-kuromizu-accent">Para ti</span>
                </h1>

            </div>

            {/* Selector de Categorías */}
            <div className="flex flex-wrap gap-3 mb-8">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${selectedCategory === category
                            ? 'bg-kuromizu-accent text-white'
                            : 'bg-kuromizu-card text-gray-500  hover:text-black'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Grid Productos */}
            {loading ? (
                <div className="text-center text-kuromizu-accent py-20">Cargando catálogo...</div>
            ) : products.length === 0 ? (
                <div className="text-center text-gray-500 py-20">No hay productos en esta categoría.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
                    {products.map(product => (
                        <Link
                            to={`/products/${product.id}`}
                            key={product.id}
                            className="bg-kuromizu-card border border-kuromizu-border overflow-hidden group hover:border-kuromizu-accent transition-colors"
                        >
                            <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                                {product.image_urls && product.image_urls.length > 0 ? (
                                    <>
                                        <img
                                            src={product.image_urls[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {product.image_urls[1] && (
                                            <img
                                                src={product.image_urls[1]}
                                                alt={`${product.name} hover`}
                                                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Sin imagen
                                    </div>
                                )}
                                {product.stock === 0 && (
                                    <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1">
                                        SOLD OUT
                                    </div>
                                )}
                            </div>
                            <div className="ml-1.5 ">
                                <h3 className="text-[#0B0B0B] text-xs mt-1 font-semibold truncate work-sans">{product.name}</h3>
                                <p className="text-[#0B0B0B] text-black mt-1 mb-2 text-xs font-bold work-sans">${Number(product.price).toFixed(2)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}