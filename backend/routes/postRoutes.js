import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPost,
  getFeedPosts,
  deletePost,getPostById,createComment,
  likePost
} from "../controllers/postController.js";

const postRoutes = express.Router();

postRoutes.get("/", protectRoute, getFeedPosts);
postRoutes.post("/create", protectRoute, createPost);
postRoutes.delete("/delete/:id", protectRoute, deletePost);
postRoutes.get("/:id", protectRoute, getPostById);
postRoutes.post("/:id/comment", protectRoute, createComment);
postRoutes.post("/:id/like", protectRoute,likePost);

export default postRoutes;
