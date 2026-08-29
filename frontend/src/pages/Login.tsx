import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginSchema } from '../schemas/auth.schema';

import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const { loginState } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      const response = await api.post('/auth/login', data);
      loginState(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div>
      <div>
        <h2>
          KUROMIZU <span>黒水</span>
        </h2>

        {apiError && (
          <div>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="tu@email.com"
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div>
            <label>
              Contraseña
            </label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p>
          ¿No tienes cuenta?{' '}
          <Link to="/register">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}