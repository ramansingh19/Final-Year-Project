import  express  from "express";
import { authorize, isAuthenticated } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { createFood, getAllFoodByRestaurantId, toggleFoodAvailability, updateFood } from "../controllers/food.controller.js";

const foodRouter = express.Router()

// ADMIN - CREATE FOOD
foodRouter.post("/create-Food", isAuthenticated, authorize("admin"), upload.array("images", 5), createFood)

// ADMIN - GET FOOD 
foodRouter.get("/admin/foods/:restaurantId", isAuthenticated, authorize("admin"), getAllFoodByRestaurantId)

// ADMIN - UPDATE FOOD
foodRouter.put("/admin/update-food/:foodId", isAuthenticated, authorize("admin"), upload.array("images", 5), updateFood)

// ADMIN - TOOGLE Availability 
foodRouter.patch("/admin/toggle-food/:id", isAuthenticated, authorize("admin"), toggleFoodAvailability)


export default foodRouter