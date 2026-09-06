import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
    maxStock: number;
    image_url?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, quantity: number) => void;
    clearCart: () => void;

    // UI para Drawer
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;

    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = useCallback((newItem: CartItem) => {
        setItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.id === newItem.id && item.size === newItem.size
            );

            if (existingItemIndex >= 0) {
                const newItems = [...prevItems];
                const newQuantity = newItems[existingItemIndex].quantity + newItem.quantity;
                newItems[existingItemIndex].quantity = Math.min(newQuantity, newItems[existingItemIndex].maxStock);
                return newItems;
            } else {
                return [...prevItems, newItem];
            }
        });
        setIsCartOpen(true);
    }, []);

    const removeFromCart = useCallback((id: string, size: string) => {
        setItems(prevItems => prevItems.filter(item => !(item.id === id && item.size === size)));
    }, []);

    const updateQuantity = useCallback((id: string, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id, size);
            return;
        }

        setItems(prevItems => prevItems.map(item => {
            if (item.id === id && item.size === size) {
                return { ...item, quantity: Math.min(quantity, item.maxStock) };
            }
            return item;
        }));
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    // Total de dinero
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Cuantos artículos en total hay (x ejem: 2 playeras rojas cuentan como 2)
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    const value = useMemo(() => ({
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount
    }), [items, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, cartTotal, cartCount]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe de ser usado dentro de un CartProvider');
    }
    return context;
}
