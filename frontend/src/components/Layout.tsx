import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import AuthDrawer from './AuthDrawer';
import CartDrawer from './CartDrawer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-kuromizu-bg text-black relative font-sans flex flex-col">
      <div className={isHomePage 
        ? "absolute top-0 left-0 w-full p-8 z-20 text-white" 
        : "w-full p-8 z-20 bg-kuromizu-bg text-black border-b border-gray-100"
      }>
        <Navbar onProfileClick={() => setIsDrawerOpen(true)} />
      </div>

      <AuthDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <CartDrawer />

      <main className={isHomePage ? "" : "flex-grow"}>
        {children}
      </main>
    </div>
  );
}
