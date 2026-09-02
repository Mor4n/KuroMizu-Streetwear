import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import checkoutRoutes from './routes/checkout.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

dotenv.config();

const app = express();


// Middlewares globales
app.use(cors());

app.use('/api/webhook', webhookRoutes);

app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);



// Endpoint de prueba (Health check)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'KuroMizu API activa <3' });
});

export default app;