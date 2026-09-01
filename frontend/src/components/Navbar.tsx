import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onProfileClick: () => void;
}

export default function Navbar({ onProfileClick }: NavbarProps) {
  const { user } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="flex justify-between items-center pb-6 border-b border-gray-200 relative z-10">
      <h1 className="text-2xl font-light tracking-[0.2em] uppercase">
        KUROMIZU <span className="text-kuromizu-accent font-bold ml-1">黒水</span>
      </h1>
      <div className="flex gap-6 items-center">
        <button
          onClick={() => setIsCartOpen(true)}
          className="group flex items-center gap-2 hover:text-gray-500 transition-colors cursor-pointer relative"
          aria-label="Carrito de compras"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>

        {user ? (
          <button
            onClick={onProfileClick}
            className="group flex items-center gap-2 hover:text-gray-500 transition-colors cursor-pointer"
            aria-label="Menu de cuenta"
          >
            <span className="text-xs font-semibold uppercase tracking-widest hidden md:inline">{user.name}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-5 h-5 transition-transform group-hover:scale-110"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onProfileClick}
            className="group flex items-center gap-2 hover:text-gray-500 transition-colors cursor-pointer"
            aria-label="Menu de usuario"
          >
            <span className="text-xs font-semibold uppercase tracking-widest hidden md:inline">Perfil</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-5 h-5 transition-transform group-hover:scale-110"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
