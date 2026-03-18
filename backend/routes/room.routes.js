import express from 'express'
import { createRoom, getAllRoomsByID } from '../controllers/room.controller.js';
import { authorize, isAuthenticated } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';


const roomRouter = express.Router()

roomRouter.post(
  "/create-room",
  isAuthenticated,
  authorize("admin"),
  upload.array("images", 5),
  createRoom
);

roomRouter.get(
  "/admin/rooms/:hotelId",
  isAuthenticated,
  authorize("admin"),
  getAllRoomsByID
);

export default roomRouter