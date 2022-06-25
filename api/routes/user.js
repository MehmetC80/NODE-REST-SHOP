import express from 'express';
import mongoose from 'mongoose';

import { User } from '../models/user.js';

const router = express.Router();

router.post('/signup', (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    password: req.body.password,
  });
});

export const userRoutes = router;
