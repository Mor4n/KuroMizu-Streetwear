import { supabase } from '../config/supabase.js';

export const getProducts = async (req, res) => {
    try {
        const { category, search, include_archived } = req.query;

        let query = supabase
            .from('products')
            .select('*, product_sizes(*)')
            .order('created_at', { ascending: false });

        if (include_archived !== 'true') {
            query = query.eq('is_active', true);
        }

        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

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

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image_urls, sizes } = req.body;

        const { data: newProduct, error: productError } = await supabase
            .from('products')
            .insert([{ name, description, price, category, image_urls, is_active: true }])
            .select()
            .single();

        if (productError) throw productError;

        if (sizes && sizes.length > 0) {
            const sizesToInsert = sizes.map(s => ({
                id_product: newProduct.id,
                size: s.size,
                stock: s.stock
            }));

            const { error: sizesError } = await supabase
                .from('product_sizes')
                .insert(sizesToInsert);

            if (sizesError) throw sizesError;
        }

        res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, image_urls, sizes } = req.body;

        const { error: productError } = await supabase
            .from('products')
            .update({ name, description, price, category, image_urls })
            .eq('id', id);

        if (productError) throw productError;

        if (sizes) {
            await supabase.from('product_sizes').delete().eq('id_product', id);

            if (sizes.length > 0) {
                const sizesToInsert = sizes.map(s => ({
                    id_product: id,
                    size: s.size,
                    stock: s.stock
                }));
                const { error: sizesError } = await supabase.from('product_sizes').insert(sizesToInsert);
                if (sizesError) throw sizesError;
            }
        }

        res.status(200).json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

export const archiveProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('products')
            .update({ is_active: false })
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Producto ocultado/archivado exitosamente' });
    } catch (error) {
        console.error('Error archiving product:', error);
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
};

export const unarchiveProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('products')
            .update({ is_active: true })
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Producto desarchivado exitosamente' });
    } catch (error) {
        console.error('Error unarchiving product:', error);
        res.status(500).json({ message: 'Error al desarchivar producto', error: error.message });
    }
};