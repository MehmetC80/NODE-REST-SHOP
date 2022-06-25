import express from 'express';
import multer from 'multer';
import { Product } from '../models/products.js';
import mongoose from 'mongoose';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const router = express.Router();

const fileFilter = (req, file, cb) => {
  //accept a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    //reject file
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get('/', (req, res, next) => {
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
});

router.post('/', upload.single('productImage'), (req, res, next) => {
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
});

router.patch('/:productId', (req, res, next) => {
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
});

router.get('/:productId', (req, res, next) => {
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
});

router.delete('/:productId', (req, res, next) => {
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
});

export const productRoutes = router;
