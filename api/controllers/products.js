import mongoose from 'mongoose';
import { Product } from '../models/products.js';

export const getAllProducts = (req, res, next) => {
  Product.find()
    .select(' name price _id productImage ')
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        products: doc.map((d) => {
          return {
            name: d.name,
            price: d.price,
            productImage: d.productImage,
            _id: d._id,
            request: {
              type: 'GET',
              url: `http://localhost:4711/products/d._id${d._id}`,
            },
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

export const createProduct = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Created product successfuly',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'POST',
            url: `http://localhost:4711/products${result._id}`,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

export const updateSingleProduct = (req, res, next) => {
  const id = req.params.productId;
  //for updating indivilue entry not the hole product
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne(
    { _id: id },
    {
      $set: updateOps,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

export const getSingleProduct = (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then((doc) => {
      console.log(`From MongoDb: ${doc}`);
      if (doc) {
        res.status(200).json({
          request: {
            type: 'GET',
            description: 'GET_ONE_PRODUCT',
            url: `http://loaclhost:4711/products`,
          },
        });
      } else {
        res.status(404).json({
          message: ' No valid entry found for provided ID ',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

export const deleteProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((res) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      req.status(500).json({
        error: err,
      });
    });
};
