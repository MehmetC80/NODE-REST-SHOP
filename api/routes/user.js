import { checkAuth } from '../middleware/check-auth.js';
import { deleteUser } from '../controllers/user.js';
import express from 'express';
import { userLogin } from '../controllers/user.js';
import { userSignUp } from '../controllers/user.js';

const router = express.Router();

//Handle incoming POST request to signup a user
router.post('/signup', userSignUp);

//Handle incoming POST request to login a user
router.post('/login', userLogin);

//Handle incoming DELETE request to delete a user
router.delete('/:userId', checkAuth, deleteUser);

export const userRoutes = router;
