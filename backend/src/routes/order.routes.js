import express from 'express';
import { getAllOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, getAllOrders);
router.patch('/:id', verifyToken, isAdmin, updateOrderStatus);

export default router;
