import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createPost, getFeedPosts,deletePost } from '../controllers/postController.js';

const postRoutes = express.Router();

postRoutes.get('/',protectRoute,getFeedPosts);
postRoutes.post('/create',protectRoute,createPost);
postRoutes.delete('/delete/:id',protectRoute,deletePost);

export default postRoutes;