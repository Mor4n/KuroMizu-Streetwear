import { supabase } from '../config/supabase.js';

export const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;

        let query = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        // Filtrado por categoría
        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

        // Búsqueda por texto en el nombre
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        const { data: products, error } = await query;

        if (error) throw error;

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: product, error } = await supabase
            .from('products')
            .select('*, product_sizes(*)')
            .eq('id', id)
            .single();

        if (error || !product) {
            console.error("Supabase Error:", error);
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
};