import express from "express"
import { createHotel, getHotelbyid, updateHotel } from "../controllers/hotel.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const hotelRouter = express.Router();

hotelRouter.post("/" , upload.array("images" , 5), createHotel)
hotelRouter.get("/", getHotelbyid)
hotelRouter.put("/:id" , upload.array("images", 5) , updateHotel)

export default hotelRouter;