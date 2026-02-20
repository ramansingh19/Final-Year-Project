import express from "express";
import {
  createCity,
  deleteCity,
  getActiveCities,
  getCityById,
  getNearbyCities,
  updateCity,
} from "../controllers/city.controller.js";
import { authorize, isAuthenticated } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const cityRouter = express.Router();

/* ------------ ADMIN ROUTES ------------ */

// Admin creates city
cityRouter.post(
  "/",
  isAuthenticated,
  authorize("super_admin" , "admin"),
  "/", 
  upload.array("images", 5),
  createCity,
);

// Admin updates city
cityRouter.put(
  "/:id",
  isAuthenticated,
  authorize("admin", "super_admin"),
  upload.array("images", 5),
  updateCity,
);

// Super Admin deactivates city
cityRouter.delete(
  "/:id",
  isAuthenticated,
  authorize("super_admin"),
  deleteCity,
);

/* ------------ PUBLIC ROUTES ------------ */

cityRouter.get("/", getActiveCities);
cityRouter.get("/nearby", getNearbyCities);
cityRouter.get("/:id", getCityById);

export default cityRouter;
