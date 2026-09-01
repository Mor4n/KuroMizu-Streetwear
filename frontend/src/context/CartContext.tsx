import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
    image_url?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, quantity: number) => void;
    clearCart: () => void;
    
    // UI state para el Drawer
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    
    // Utilidades
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (newItem: CartItem) => {
        setItems(prevItems => {
            // Buscamos si ya existe el MISMO producto con la MISMA talla
            const existingItemIndex = prevItems.findIndex(
                item => item.id === newItem.id && item.size === newItem.size
            );

            if (existingItemIndex >= 0) {
                // Si existe, solo sumamos la cantidad
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += newItem.quantity;
                return newItems;
            } else {
                // Si es un producto nuevo o talla diferente, lo agregamos como nuevo item
                return [...prevItems, newItem];
            }
        });
        
        // Abrir el carrito automáticamente para que el usuario vea que se agregó
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string, size: string) => {
        setItems(prevItems => prevItems.filter(item => !(item.id === id && item.size === size)));
    };

    const updateQuantity = (id: string, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id, size);
            return;
        }
        
        setItems(prevItems => prevItems.map(item => 
            (item.id === id && item.size === size) ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
    };

    // Calculamos el total de dinero
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculamos cuántos artículos en total hay (ej: 2 playeras rojas cuentan como 2)
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used dentro de un CartProvider');
    }
    return context;
}
