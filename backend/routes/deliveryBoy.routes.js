import express from "express"
import { getDeliveryBoyProfile } from "../controllers/deliveryBoy.controller.js"
import { authorize, isAuthenticated } from "../middleware/auth.middleware.js"

const deliveryBoyRouter = express.Router()

deliveryBoyRouter.get("/profile", isAuthenticated, authorize("admin"), getDeliveryBoyProfile)

export default deliveryBoyRouter