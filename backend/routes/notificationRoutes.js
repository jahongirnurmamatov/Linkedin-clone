import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { deleteNotification, getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';

const notificationRoutes = express.Router();


notificationRoutes.get('/',protectRoute,getNotifications);
notificationRoutes.put('/:id/read',protectRoute,markNotificationAsRead);
notificationRoutes.delete('/:id',protectRoute,deleteNotification);



export default notificationRoutes;