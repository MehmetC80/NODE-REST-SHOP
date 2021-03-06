import mongoose from 'mongoose';
import { Order } from '../models/orders.js';
import { Product } from '../models/products.js';

export const getAllOrders = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: `http://localhost:4711/orders/${doc._id}`,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

export const createNewOrder = (req, res, next) => {
  //only created an order  if an productId exists
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: 'POST',
          url: `http://localhost:4711/orders`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

export const getSingleOrder = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: 'order not found',
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:4711/orders',
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'order not found',
        error: err,
      });
    });
};

export const deleteSingleOrder = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:4711/orders',
          body: { productId: 'ID', quantity: 'Number' },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'order not found',
        error: err,
      });
    });
};
