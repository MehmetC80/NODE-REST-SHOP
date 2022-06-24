import express from 'express';

import { productModell } from '../models/products.js';

import mongoose from 'mongoose';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requests to /products',
  });
});

router.post('/', (req, res, next) => {
  const product = new productModell({
    _id: new mongoose.Schema.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err));

  res.status(201).json({
    message: 'Handling POST request to /products',
    createdProduct: product,
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  if (id === 'special') {
    res.status(200).json({
      message: 'Yo discovered the spezil ID',
      id: id,
    });
  } else {
    res.status(200).json({
      message: 'You passed an ID',
    });
  }
});

router.patch('/:procuctId', (req, res, next) => {
  res.status(200).json({
    message: 'updated product!',
  });
});

router.delete('/:productsId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted product!',
  });
});

export const productRoutes = router;
