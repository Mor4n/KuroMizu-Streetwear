import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    email: z.email('Formato de correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['client', 'admin']).optional().default('client')
});

export const loginSchema = z.object({
    email: z.string().email('Formato de correo electrónico inválido'),
    password: z.string().min(1, 'La contraseña es requerida')
});