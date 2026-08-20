import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

export const register = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        // Verificación de si existe el usuario
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10); // sal para evitar ataques de 'tablas arcoiris'
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar usuario en la base de datos
        const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ name, email, password: hashedPassword, role: role || 'client' }])
        .select('id, name, email, role, created_at')
        .single();

        if (error) throw error;

        // Generar JWT
        const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
        );

        res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: newUser,
        token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por correo
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar hashes
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};