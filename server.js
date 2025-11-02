import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

import uploadRoutes from './routes/uploadRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";



const app = express();
connectDB();

// middleware
app.use(helmet());
app.use(cors({
  origin: env.clientOrigins === '*' ? true : env.clientOrigins,
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('tiny'));
app.use(rateLimit({ windowMs: 60_000, max: 300 }));

// routes
app.get('/', (req, res) => res.send('Elva Store API ✅'));
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
// errors
app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => console.log(`🚀 API on :${env.port}`));
