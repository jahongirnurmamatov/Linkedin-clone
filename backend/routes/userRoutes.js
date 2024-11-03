import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getPublicProfile, getSugestedConnection, updateProfile } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.get('/suggestions',protectRoute,getSugestedConnection);
userRoutes.get('/:username',protectRoute,getPublicProfile);

userRoutes.put('/profile',protectRoute,updateProfile);

export default userRoutes;