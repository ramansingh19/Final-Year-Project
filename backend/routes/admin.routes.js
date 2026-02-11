import express from 'express'
import { upload } from '../middleware/multer.middleware.js'
import { adminLogin, adminRegistration, adminVerification } from '../controllers/admin.controller.js'

const adminRouter = express.Router()

adminRouter.post('/admin-registration', upload.fields([
  {
    name: "avatar",
      maxCount: 1,
  }
]), adminRegistration)
adminRouter.post('/admin-verification', adminVerification)
adminRouter.post('/admin-login', adminLogin)

export { adminRouter }