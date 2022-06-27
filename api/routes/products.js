import { checkAuth } from '../middleware/check-auth.js';
import { createProduct } from '../controllers/products.js';
import { deleteProduct } from '../controllers/products.js';
import express from 'express';
import { getAllProducts } from '../controllers/products.js';
import { getSingleProduct } from '../controllers/products.js';
import multer from 'multer';
import { updateSingleProduct } from '../controllers/products.js';

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

//Handle incoming GET requests to get all prodcts
router.get('/', getAllProducts);

// Handle incoming POST requests to create a new product
router.post('/', checkAuth, upload.single('productImage'), createProduct);

// Handle incoming PATCH requests to update a product
router.patch('/:productId', checkAuth, updateSingleProduct);

// Handle incoming GET requests to get a single product
router.get('/:productId', getSingleProduct);

//Handle incoming DELETE request to delete a single product
router.delete('/:productId', checkAuth, deleteProduct);

export const productRoutes = router;
