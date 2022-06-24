import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  price: Number,
});

export const productModell = mongoose.model('Product', productSchema);
