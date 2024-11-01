import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getPublicProfile, getSugestedConnection } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.get('/suggestion',protectRoute,getSugestedConnection);
userRoutes.get('/:username',protectRoute,getPublicProfile);

export default userRoutes;