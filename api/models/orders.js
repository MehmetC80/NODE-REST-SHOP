import mongoose from 'mongoose';
import { checkAuth } from '../middleware/check-auth.js';

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, default: 1 },
});

export const Order = mongoose.model('Order', orderSchema);
