import express from 'express';

import bcrypt from 'bcrypt';

import { User } from '../models/user.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
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

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({ message: 'Auth faild' });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: 'Auth faild' });
        }
        if (result) {
          return res.status(200).json({
            massage: 'Auth successful',
          });
        }
        res.status(401).json({ message: 'Auth faild' });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((ressult) => {
      res.status(200).json({ message: 'deleted user' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

export const userRoutes = router;
