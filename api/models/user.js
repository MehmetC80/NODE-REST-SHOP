import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = mongoose.model('User', userSchema);
