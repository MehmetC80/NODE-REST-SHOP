import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { productRoutes } from './api/routes/products.js';
import { orderRoutes } from './api/routes/orders.js';

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(morgan('dev'));

// Routes which should handle requsts
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
