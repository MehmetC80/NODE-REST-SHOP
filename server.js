import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { productRoutes } from './api/routes/products.js';
import { orderRoutes } from './api/routes/orders.js';

dotenv.config();

const port = process.env.PORT;

const app = express();

//middleware for detailed request message in the console
app.use(morgan('dev'));

//middleware for parseing data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes which should handle requsts
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//Errorhandler for not existing routes
app.use((req, res, next) => {
  const error = new Error('Page not found');
  error.status = 404;
  res.status(404).send(
    `<body style="background-color:#333">
      <h1 style="color:#ccc; text-align:center;margin:20% auto;">Ooops 404!!!</h1>
      </body>`
  );
  next(error);
});

//Errorhandler for Database errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
