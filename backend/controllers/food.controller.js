import { uploadCloudinary } from "../config/cloudinary.config.js";
import fs from "fs";
import { Food } from "../model/food.model.js";
import { Restaurant } from "../model/restaurant.model.js";
import mongoose from "mongoose";

// ADMIN - CREATE FOOD
export const createFood = async (req, res) => {
  try {
    const { restaurantId, name, description, price, category, isVeg } =
      req.body;

    // validation
    if (
      !restaurantId ||
      !name ||
      !description ||
      !category ||
      isVeg === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    // restaurant check
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // ownership check
    if (req.user.role !== "superAdmin") {
      if (!restaurant.owner.equals(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: "You can only add food to your own restaurant",
        });
      }
    }

    // active check
    if (restaurant.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Restaurant must be active to add food items",
      });
    }

    // duplicate check
    const existingFood = await Food.findOne({
      name: name.trim().toLowerCase(),
      restaurant: restaurantId,
    });

    if (existingFood) {
      return res.status(409).json({
        success: false,
        message: "Food item already exists in this restaurant",
      });
    }

    // upload images
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadCloudinary(file.path, "foods");

        imageUrls.push(uploadResult.secure_url);

        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    // create food
    const food = await Food.create({
      restaurantId,
      name: name.trim().toLowerCase(),
      description,
      price,
      category,
      isVeg,
      images: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: "Food created successfully",
      data: food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN - GET FOOD
export const getAllFoodByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // ✅ validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    // chack restaurant existence
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res
        .status(400)
        .json({ success: false, message: "restaurant not exist" });
    }

    // admin ownership check
    if (req.user.role === "admin" && !restaurant.owner.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You cannot view foods of other admin restaurant",
      });
    }

    const foods = await Food.find({ restaurantId }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ success: true, count: foods.length, data: foods });
  } catch (error) {
    console.log("GET ROOMS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN - UPDATE FOOD
export const updateFood = async (req, res) => {
  try {
    
    const { foodId } = req.params;
    const { name, description, price, category, isVeg } = req.body;
    // Find Food
    const food = await Food.findById(foodId);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "food not found" });
    }

    // Find Restaurant
    const restaurant = await Restaurant.findById(food.restaurantId);

    // Admin Ownership Check
    if (req.user.role === "admin" && !restaurant.owner.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You can't update other admin's food",
      });
    }

    // IMAGE UPLOAD
    let imageUrls = food.images;

    if (req.files?.length > 0) {
      imageUrls = [];
      for (const file of req.files) {
        const upload = await uploadCloudinary(file.path, "foods");
        imageUrls.push(upload.secure_url);

        // delete local file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    // ✅ UPDATE FIELDS
    food.name = name?.trim().toLowerCase() || food.name;
    food.description = description || food.description;
    food.price = price || food.price;
    food.category = category || food.category;
    food.isVeg = isVeg !== undefined ? isVeg : food.isVeg;
    food.images = imageUrls;

    await food.save();
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
};

// ADMIN - Toggle Availability 
export const toggleFoodAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find food
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // ✅ Find restaurant
    const restaurant = await Restaurant.findById(food.restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // ✅ Ownership check (ADMIN)
    if (
      req.user.role === "admin" &&
      !restaurant.owner.equals(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot update other admin's food",
      });
    }

    // ✅ Optional: Only active restaurant can modify food
    if (restaurant.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Restaurant must be active",
      });
    }

    // ✅ Toggle availability
    food.isAvailable = !food.isAvailable;
    await food.save();

    return res.status(200).json({
      success: true,
      message: `Food is now ${
        food.isAvailable ? "Available" : "Unavailable"
      }`,
      data: food,
    });

  } catch (error) {
    console.error("TOGGLE FOOD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN - Delete Food
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    // Find food
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Find restaurant
    const restaurant = await Restaurant.findById(food.restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Ownership check (IMPORTANT)
    if (
      req.user.role === "admin" &&
      !restaurant.owner.equals(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete food from another admin's restaurant",
      });
    }

    // Delete
    await Food.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });

  } catch (error) {
    console.error("DELETE FOOD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// USER — GET SINGLE FOOD BY ID (public, active restaurant + available food only)
export const getFoodByIdForUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }

    const food = await Food.findById(id).populate({
      path: "restaurantId",
      select: "name city status images address avgCostForOne foodType famousFood",
      populate: { path: "city", select: "name state" },
    });

    if (!food || !food.restaurantId) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    if (food.restaurantId.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Food not available",
      });
    }

    if (!food.isAvailable) {
      return res.status(404).json({
        success: false,
        message: "This item is currently unavailable",
      });
    }

    return res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    console.error("GET FOOD BY ID (USER) ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE FOOD By ID
export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find food
    const food = await Food.findById(id).populate(
      "restaurantId",
      "name owner status"
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Ownership check (ADMIN)
    if (
      req.user.role === "admin" &&
      !food.restaurantId.owner.equals(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot view other admin's food",
      });
    }

    return res.status(200).json({
      success: true,
      data: food,
    });

  } catch (error) {
    console.error("GET FOOD BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL FOOD
// export const getAllFood = async (req, res) => {
//   try {
//     const foods = await Food.find()
//       .populate("restaurant", "name city")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       data: foods,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// USER - GET ALL FOOD 
export const getAllFoodForUser = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      restaurantId,
      category,
      isVeg,
    } = req.query;

    const skip = (page - 1) * limit;

    let filter = {
      isAvailable: true, // ✅ only available food
    };

    //  filter by restaurant
    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }

    //  filter by category
    if (category) {
      filter.category = category;
    }

    // filter veg/non-veg
    if (isVeg !== undefined) {
      filter.isVeg = isVeg === "true";
    }

    const foods = await Food.find(filter)
      .populate({
        path: "restaurantId",
        match: { status: "active" }, //  only active restaurants
        select: "name city",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // remove foods whose restaurant is null (inactive)
    const filteredFoods = foods.filter((f) => f.restaurantId !== null);

    const total = await Food.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: filteredFoods,
      page: Number(page),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("USER FOOD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};