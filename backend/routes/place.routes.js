import express from "express"
import { isAuthenticated, authorize } from "../middleware/auth.middleware.js";
import { createPlace, deletePlace, getActivePlacesCityWise, getPlacesCityWise, getplacebyid, updatePlace } from "../controllers/place.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const placeRouter = express.Router();

// superAdmin - create Place
placeRouter.post("/create-place", isAuthenticated, authorize("super_admin"), upload.array("images" , 5), createPlace)

// superAdmin - update Place
placeRouter.put("/updatedata/:id", isAuthenticated, authorize("super_admin"), upload.array("images" , 5), updatePlace)

// SuperAdmin - delete Place
placeRouter.delete("/deleteplace/:id", isAuthenticated , authorize("super_admin"), deletePlace)

// SuperAdmin - getPlacesCityWise
placeRouter.get(
  "/city-wise",
  isAuthenticated,
  authorize("super_admin"),
  getPlacesCityWise
);

// superAdmin - getActivePlaceCityWise
placeRouter.get("/activePlace/city-wise", isAuthenticated, authorize("super_admin"),  getActivePlacesCityWise)

placeRouter.get("/getplace/:id", getplacebyid)

export default placeRouter;