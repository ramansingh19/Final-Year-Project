import { uploadCloudinary } from "../config/cloudinary.config.js";
import { Admin } from "../model/admin.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { verifyEmail } from "../verifyEmail/verifyEmail.js";

export const adminRegistration = async (req, res) => {
  try {
    const { adminName, email, contactNumber, password, role } = req.body;

    if (
      [adminName, email, contactNumber, password, role].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const adminExistance = await Admin.findOne({ email });
    if (adminExistance) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Avatar file is required",
      });
    }

    const avatar = await uploadCloudinary(avatarLocalPath);
    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "Failed to upload avatar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      adminName,
      email,
      contactNumber,
      password: hashedPassword,
      avatar: avatar.url,
      role,
    });

    const token = jwt.sign({id: newAdmin._id}, process.env.SECRET_KET, {expiresIn: '1d'});
    newAdmin.token = token;
    verifyEmail(email, token);

    await newAdmin.save();


    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      adminId: newAdmin._id,
      data: newAdmin
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const adminVerification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(400).json({success: false, message: 'Authorization token is missing or Invalid'})
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KET)
    } catch (error) {
      if(error.name === 'TokenExpiredError'){
        return res.status(400).json({success: false, message: 'this registration token has expired'})
      }
      return res.status(400).json({success: false, message: 'token verification is failed'})
    }

    const admin = await Admin.findById(decoded.id)
    if(!admin){
      return res.status(400).json({success: false, message: 'admin not found'})
    }

    admin.token = null,
    admin.isVerified = true
    await admin.save();

    return res.status(200).json({success: true, message:'admin verification successfully'})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}