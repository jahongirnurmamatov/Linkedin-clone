import express from 'express';
import { login, logout, signup,getCurrentUser } from '../controllers/authController.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

authRouter.get("/me",protectRoute,getCurrentUser);

export default authRouter;
