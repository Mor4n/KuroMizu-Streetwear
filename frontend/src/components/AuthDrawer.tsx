import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDrawer({ isOpen, onClose }: AuthDrawerProps) {
  const { loginState, user, logout } = useAuth();
  const [drawerMode, setDrawerMode] = useState<'menu' | 'login' | 'register'>('menu');
  const [apiError, setApiError] = useState('');

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLogin
  } = useForm({ resolver: zodResolver(loginSchema) });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
    reset: resetSignup
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onLogin = async (data: any) => {
    try {
      setApiError('');
      const response = await api.post('/auth/login', data);
      loginState(response.data.user, response.data.token);
      onClose();
      setDrawerMode('menu');
      resetLogin();
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const onRegister = async (data: any) => {
    try {
      setApiError('');
      const response = await api.post('/auth/register', data);
      loginState(response.data.user, response.data.token);
      onClose();
      setDrawerMode('menu');
      resetSignup();
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Error al registrar usuario');
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setDrawerMode('menu');
      setApiError('');
      resetLogin();
      resetSignup();
    }, 300);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/80 backdrop-blur-md z-40 transition-opacity"
          onClick={handleClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-[0_0_40px_rgba(0,0,0,0.05)] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } overflow-y-auto`}
      >
        <div className="p-10 flex flex-col min-h-full">
          <div className="flex justify-between items-center mb-16 pb-6 border-b border-gray-300">
            <h2 className="text-xs font-bold tracking-[0.2em] text-gray-700 uppercase">
              {drawerMode === 'menu' && 'Menú '}
              {drawerMode === 'login' && 'Autenticación '}
              {drawerMode === 'register' && 'Registrarse '}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {apiError && (
            <div className="bg-red-50 border-l-2 border-kuromizu-accent text-kuromizu-accent px-4 py-3 text-sm mb-8 font-semibold">
              {apiError}
            </div>
          )}

          {drawerMode === 'menu' && (
            <div className="flex flex-col gap-8">
              {user ? (
                <>
                  <button
                    className="w-full text-left group"
                  >
                    <div className="flex justify-between items-center py-4 border-b border-gray-300 group-hover:border-black transition-colors">
                      <span className="text-2xl font-medium tracking-wide text-gray-800 group-hover:text-black transition-colors">Editar cuenta</span>
                      <span className="text-gray-500 group-hover:text-kuromizu-accent transition-colors font-bold">&rarr;</span>
                    </div>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        handleClose();
                        window.location.href = '/admin';
                      }}
                      className="w-full text-left group"
                    >
                      <div className="flex justify-between items-center py-4 border-b border-gray-300 group-hover:border-black transition-colors">
                        <span className="text-2xl font-medium tracking-wide text-gray-800 group-hover:text-black transition-colors">Panel Admin</span>
                        <span className="text-gray-500 group-hover:text-kuromizu-accent transition-colors font-bold">&rarr;</span>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleClose();
                      window.location.href = '/my-orders';
                    }}
                    className="w-full text-left group"
                  >
                    <div className="flex justify-between items-center py-4 border-b border-gray-300 group-hover:border-black transition-colors">
                      <span className="text-2xl font-medium tracking-wide text-gray-800 group-hover:text-black transition-colors">Historial de compras</span>
                      <span className="text-gray-500 group-hover:text-kuromizu-accent transition-colors font-bold">&rarr;</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      handleClose();
                    }}
                    className="w-full text-left group"
                  >
                    <div className="flex justify-between items-center py-4 border-b border-gray-300 group-hover:border-black transition-colors">
                      <span className="text-2xl font-medium tracking-wide text-kuromizu-accent transition-colors">Cerrar sesión</span>
                      <span className="text-kuromizu-accent font-bold">&rarr;</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setDrawerMode('login'); setApiError(''); }}
                    className="w-full text-left group"
                  >
                    <div className="flex justify-between items-center py-4 border-b border-gray-300 group-hover:border-black transition-colors">
                      <span className="text-2xl font-medium tracking-wide text-gray-800 group-hover:text-black transition-colors">Iniciar Sesión</span>
                      <span className="text-gray-500 group-hover:text-kuromizu-accent transition-colors font-bold">&rarr;</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setDrawerMode('register'); setApiError(''); }}
                    className="w-full text-left group"
                  >
                    <div className="flex justify-between items-center py-4 border-b border-gray-300 group-hover:border-black transition-colors">
                      <span className="text-2xl font-medium tracking-wide text-gray-800 group-hover:text-black transition-colors">Registrarse</span>
                      <span className="text-gray-500 group-hover:text-kuromizu-accent transition-colors font-bold">&rarr;</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          )}

          {drawerMode === 'login' && (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-8">
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-700 uppercase mb-3">Email</label>
                <input
                  type="email"
                  {...registerLogin('email')}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-400 font-medium text-lg"
                  placeholder="tu@email.com"
                />
                {loginErrors.email && <p className="text-xs font-bold text-kuromizu-accent mt-2">{String(loginErrors.email.message)}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-700 uppercase mb-3">Contraseña</label>
                <input
                  type="password"
                  {...registerLogin('password')}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-400 font-medium text-lg"
                  placeholder="••••••••"
                />
                {loginErrors.password && <p className="text-xs font-bold text-kuromizu-accent mt-2">{String(loginErrors.password.message)}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoginSubmitting}
                  className="group w-full py-4 bg-transparent border-2 border-black text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-black hover:text-white disabled:opacity-50 transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-3"
                >
                  <span className="relative z-10">{isLoginSubmitting ? 'Verificando...' : 'Entrar'}</span>
                  {!isLoginSubmitting && <span className="relative z-10 group-hover:translate-x-1 transition-transform">&rarr;</span>}
                </button>
              </div>

              <button
                type="button"
                onClick={() => { setDrawerMode('menu'); setApiError(''); resetLogin(); }}
                className="w-full mt-6 text-xs font-bold text-gray-600 hover:text-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <span>&larr;</span> Atrás
              </button>
            </form>
          )}

          {drawerMode === 'register' && (
            <form onSubmit={handleSignupSubmit(onRegister)} className="space-y-8">
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-700 uppercase mb-3">Nombre</label>
                <input
                  type="text"
                  {...registerSignup('name')}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-400 font-medium text-lg"
                  placeholder="Tu nombre"
                />
                {signupErrors.name && <p className="text-xs font-bold text-kuromizu-accent mt-2">{String(signupErrors.name.message)}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-700 uppercase mb-3">Email</label>
                <input
                  type="email"
                  {...registerSignup('email')}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-400 font-medium text-lg"
                  placeholder="tu@email.com"
                />
                {signupErrors.email && <p className="text-xs font-bold text-kuromizu-accent mt-2">{String(signupErrors.email.message)}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-700 uppercase mb-3">Contraseña</label>
                <input
                  type="password"
                  {...registerSignup('password')}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-400 font-medium text-lg"
                  placeholder="••••••••"
                />
                {signupErrors.password && <p className="text-xs font-bold text-kuromizu-accent mt-2">{String(signupErrors.password.message)}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSignupSubmitting}
                  className="group w-full py-4 bg-transparent border-2 border-black text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-black hover:text-white disabled:opacity-50 transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-3"
                >
                  <span>{isSignupSubmitting ? 'Procesando...' : 'Completar Registro'}</span>
                  {!isSignupSubmitting && <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>}
                </button>
              </div>

              <button
                type="button"
                onClick={() => { setDrawerMode('menu'); setApiError(''); resetSignup(); }}
                className="w-full mt-6 text-xs font-bold text-gray-600 hover:text-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <span>&larr;</span> Atrás
              </button>
            </form>
          )}


        </div>
      </div>
    </>
  );
}
