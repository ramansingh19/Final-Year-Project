import express from "express"
import { createCity } from "../controllers/city.controller.js"
import { upload } from "../middleware/multer.middleware.js"

const router = express.Router()

router.post("/", upload.fields([
  {
    name : "images",
    maxCount : 1,

  }
]) ,  createCity) 

export default router