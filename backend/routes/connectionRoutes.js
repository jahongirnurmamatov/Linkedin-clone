import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptConnectRequest,
  deleteConnection,
  getConnectionRequests,
  getConnections,
  getConnectionStatus,
  rejectConenctionRequest,
  sendConenctionRequest,
} from "../controllers/connectionController.js";

const router = express.Router();

router.post("/request/:userId", protectRoute, sendConenctionRequest);
router.post("/accept/:requestId", protectRoute, acceptConnectRequest);
router.post("/reject/:requestId", protectRoute, rejectConenctionRequest);

router.get("/requests", protectRoute, getConnectionRequests);

router.get("/", protectRoute, getConnections);
router.delete("/:userId", protectRoute, deleteConnection);
router.get("/status/:userId", protectRoute,  getConnectionStatus);

export default router;
