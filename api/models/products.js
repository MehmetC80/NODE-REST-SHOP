import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    requird: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productImage: { type: String, required: true },
});

export const Product = mongoose.model('Product', productSchema);
