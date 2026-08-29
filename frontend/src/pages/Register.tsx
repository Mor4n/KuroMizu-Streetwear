import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerSchema } from '../schemas/auth.schema';

import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Register() {
  const { loginState } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      const response = await api.post('/auth/register', data);
      loginState(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Error al registrar usuario');
    }
  };

  return (
    <div>
      <div>
        <h2>
          KUROMIZU <span>黒水</span>
        </h2>
        <p>Crea tu cuenta de acceso</p>

        {apiError && (
          <div>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>
              Nombre Completo
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Tu nombre"
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

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
            {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}