import dotenv from 'dotenv';

import express from 'express';

import { productRoutes } from './api/routes/products.js';
import { orderRoutes } from './api/routes/orders.js';

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
