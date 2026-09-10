import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, archiveProduct, unarchiveProduct, deleteProduct } from '../controllers/product.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas protegidas de solo admin
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, archiveProduct);
router.delete('/:id/hard', verifyToken, isAdmin, deleteProduct);
router.patch('/:id/unarchive', verifyToken, isAdmin, unarchiveProduct);

export default router;