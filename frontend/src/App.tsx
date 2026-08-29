import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthDrawer from './components/AuthDrawer';

function Home() {
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen p-8 bg-kuromizu-bg text-black relative overflow-hidden font-sans">
      <header className="flex justify-between items-center pb-6 border-b border-gray-200 relative z-10">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">
          KUROMIZU <span className="text-kuromizu-accent font-bold ml-1">黒水</span>
        </h1>
        <div className="flex gap-6 items-center">
          {user ? (
            <>
              <span className="text-sm font-medium tracking-wide">Hola, {user.name}</span>
              <button
                onClick={logout}
                className="text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="group flex items-center gap-2 hover:text-gray-500 transition-colors"
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

      <AuthDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="mt-32 text-center relative z-10 px-4 max-w-4xl mx-auto flex flex-col items-center">

      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}