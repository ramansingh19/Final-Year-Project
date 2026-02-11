import mongoose, { Schema }  from "mongoose";

const placeSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    },

    cityId : {
      type : Schema.Types.ObjectId,
      ref : "City",
      required : true
    },

    description : {
      type : String,
      required : true,
    },

    category : {
      type : String,
      enum : ["temple" , "fort" , "nature" , "market" , "other"],
      required : true
    },

    timeRequired : {
      type : String,
      enum : ["1-2 hr" , "half day" , "full day"],
      required : true
    },

    entryfees : {
      type : Number,
      required : true,
      default : 0
    },

    isPopular : {
      type : String,
      default : false
    },

    bestTimeToVisit : {
      type : String,
      trim : true
    },

    images : [
      {
        type : String,
      },
    ],

    
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },

    status : {
      type : String,
      enum : ["active", "inactive" , "pending"],
      default : "pending"
    }

}, {timestamps : true})

placeSchema.index({location : "2dsphere"})

export const Place = mongoose.model("Place" , placeSchema)