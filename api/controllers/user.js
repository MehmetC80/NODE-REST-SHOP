import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import mongoose from 'mongoose';

dotenv.config();

export const userSignUp = (req, res, next) => {
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
};

export const userLogin = (req, res, next) => {
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
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
          );
          return res.status(200).json({
            massage: 'Auth successful',
            token: token,
          });
        }
        res.status(401).json({ message: 'Auth faild' });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

export const deleteUser = (req, res, next) => {
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
};
