import { City } from "../model/city.model.js";

//with the help of this we can create city 
export const createCity = async (req , res) => {
  try {
    const city = await City.create(req.body)
    console.log(city);
    
    return res
    .status(200)
    .json({
      success : true,
      message : "Successfully created",
      data : city
    });
  } catch (error) {
    return res
    .status(200)
    .json({
      success  : false,
      message : error.message
    })
  }
}