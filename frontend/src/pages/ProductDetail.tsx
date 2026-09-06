import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image_urls: string[];
    product_sizes?: { size: string; stock: number }[];
}

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart } = useCart();

    // Estados para el zoom tipo lupa
    const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
    const [isZooming, setIsZooming] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/${id}`);

            setProduct(data);

            if (data.image_urls && data.image_urls.length > 0) {
                setSelectedImage(data.image_urls[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Por favor selecciona una talla');
            return;
        }

        if (!product) return;

        setIsAdding(true);

        // Buscar stock de talla seleccionada
        const selectedPs = product.product_sizes?.find(ps => ps.size === selectedSize);
        const maxStock = selectedPs ? selectedPs.stock : product.stock;

        // Se agrega a la bolsita usando contexto
        setTimeout(() => {
            addToCart({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                size: selectedSize,
                quantity: 1,
                maxStock: maxStock,
                image_url: selectedImage || (product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : undefined)
            });
            setIsAdding(false);
        }, 400); // Pausa pa mostrar la animación en el botón
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setBackgroundPosition(`${x}% ${y}%`);
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-xl font-bold tracking-widest uppercase animate-pulse">Cargando...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Producto no encontrado</h2>
                <Link to="/" className="text-gray-500 hover:text-black underline underline-offset-4">Volver al catálogo</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            <div className="mb-6">
                <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">
                    &larr; Volver al catálogo
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
                {/* Lado Izquierdo: Galería de Imágenes */}
                <div className="w-full md:w-1/2 flex flex-col-reverse lg:flex-row gap-4">
                    {/* Willy, miniatura miniatura */}
                    {product.image_urls && product.image_urls.length > 1 && (
                        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
                            {product.image_urls.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(url)}
                                    className={`w-20 h-24 flex-shrink-0  overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === url ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                                >
                                    <img src={url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Imagen Principal */}
                    <div className="w-full aspect-[4/5] bg-gray-50  overflow-hidden relative">
                        {selectedImage ? (
                            <div
                                className="w-full h-full flex items-center justify-center cursor-crosshair relative"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsZooming(true)}
                                onMouseLeave={() => setIsZooming(false)}
                            >
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className={`max-h-[80vh] w-auto h-full object-contain transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
                                />
                                {isZooming && (
                                    <div
                                        className="absolute inset-0 bg-no-repeat pointer-events-none"
                                        style={{
                                            backgroundImage: `url(${selectedImage})`,
                                            backgroundPosition: backgroundPosition,
                                            backgroundSize: '250%'
                                        }}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                        )}
                        {product.stock === 0 && (
                            <div className="absolute top-0 right-0 bg-black text-white text-sm font-bold px-4 py-2  tracking-wider">
                                SOLD OUT
                            </div>
                        )}
                    </div>
                </div>

                {/* Lado Derecho: Información del Producto */}
                <div className="w-full md:w-1/2 flex flex-col justify-center bg-[#f5f5f5] p-8 lg:p-12 rounded-none border border-gray-200">
                    <p className="text-gray-500 font-semibold tracking-widest uppercase text-xs mb-2">{product.category}</p>
                    <h1 className="text-2xl lg:text-4xl font-display uppercase tracking-wider mb-4 leading-none">{product.name}</h1>
                    <p className="text-2xl font-bold mb-8">${Number(product.price).toFixed(2)}</p>

                    <p className="text-gray-600 mb-10 leading-relaxed font-medium">
                        {product.description || "Sin descripción disponible."}
                    </p>

                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <span className="font-bold text-sm uppercase tracking-wider">Talla</span>
                            {selectedSize && (
                                <span className="text-xs text-gray-500 font-medium tracking-wide">
                                    {product.product_sizes?.find(ps => ps.size === selectedSize)?.stock} disponibles
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {product.product_sizes && product.product_sizes.length > 0 ? (
                                product.product_sizes.map(ps => (
                                    <button
                                        key={ps.size}
                                        onClick={() => ps.stock > 0 && setSelectedSize(ps.size)}
                                        disabled={ps.stock === 0}
                                        className={`py-3 text-sm font-bold rounded-none transition-all border-1   ${ps.stock === 0
                                            ? 'opacity-40 bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 line-through'
                                            : selectedSize === ps.size
                                                ? 'border-black bg-transparent text-black cursor-pointer'
                                                : 'border-gray-200 bg-transparent text-black hover:border-black cursor-pointer'
                                            }`}
                                    >
                                        {ps.size}
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 col-span-4">No hay tallas configuradas para este producto.</p>
                            )}
                        </div>
                    </div>

                    {(() => {
                        let isSoldOut = false;
                        if (product.product_sizes && product.product_sizes.length > 0) {
                            if (selectedSize) {
                                const selectedPs = product.product_sizes.find(ps => ps.size === selectedSize);
                                isSoldOut = !selectedPs || selectedPs.stock === 0;
                            }
                        } else {
                            isSoldOut = product.stock === 0;
                        }

                        return (
                            <button
                                onClick={handleAddToCart}
                                disabled={isSoldOut || isAdding}
                                className={`w-full py-5 text-center font-bold uppercase tracking-[0.3em] rounded-none transition-all relative overflow-hidden cursor-pointer
                                    ${isSoldOut
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-900 border-2 border-black hover:border-transparent'
                                    }
                                `}
                            >
                                {isAdding ? (
                                    <span className="inline-block animate-pulse">PROCESSING...</span>
                                ) : isSoldOut ? (
                                    'OUT OF STOCK'
                                ) : (
                                    'ADD TO BAG'
                                )}
                            </button>
                        );
                    })()}

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li className="flex items-center gap-2">Envío gratis en pedidos mayores a $1000</li>
                            <li className="flex items-center gap-2">Material: 100% Algodón Premium</li>
                            <li className="flex items-center gap-2">Estampado de alta durabilidad</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
