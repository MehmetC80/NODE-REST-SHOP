import express from 'express';

import bcrypt from 'bcrypt';

import { User } from '../models/user.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(409).json({
          message: 'email allready exists in the DB',
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({ message: 'User created' });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  message: 'email already exists',
                  error: err,
                });
              });
          }
        });
      }
    });
});

export const userRoutes = router;
