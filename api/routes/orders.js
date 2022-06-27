import { checkAuth } from '../middleware/check-auth.js';
import { createNewOrder } from '../controllers/orders.js';
import { deleteSingleOrder } from '../controllers/orders.js';
import express from 'express';
import { getAllOrders } from '../controllers/orders.js';
import { getSingleOrder } from '../controllers/orders.js';

const router = express.Router();

// Handle incomming GET requests to /orders
router.get('/', checkAuth, getAllOrders);

//Handle incomming POST requests to create a new order
router.post('/', checkAuth, createNewOrder);

//Handle incomming GET request to get an single order by ID
router.get('/:orderId', checkAuth, getSingleOrder);

//Handle incomming DELETE request to delete a single order by ID
router.delete('/:orderId', checkAuth, deleteSingleOrder);

export const orderRoutes = router;
