import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";

const registerUser = asyncHandler(async (req, res) => {


  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { message: errors.array() }, "Validation Error")
      );
  }

  const { firstname, lastname, email, password, phone } = req.body;

  if (
    [firstname, lastname, email, password, phone].some(
      (field) => field?.trim() === ""
    )
  ) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { message: "Please fill all the fields" },
          "Please fill all the fields"
        )
      );
  }

  const existUser = await User.findOne({ email });

  if (existUser) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { message: "User already exists" },
          "User already exists"
        )
      );
  }

  const user = await User.create({
    username: {
      firstname,
      lastname,
    },
    email,
    password,
    phone,
  })


  const token = await user.generateAuthToken()

  const options = {
    httpOnly: true,
    secure: true
}


  if (user) {
    return res
      .status(201)
      .cookie('token', token, options)
      .json(
        new ApiResponse(
          201,
          { user,
            token,
            message: "User registered successfully" },
          "User registered successfully"
        )
      );
  } else {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          { message: "Sorry for inconvenience. Please try again." },
          "User registration failed"
        )
      );
  }
});

const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res
        .status(400)
        .json(
            new ApiResponse(400, {errors: errors.array(), message: "Enter correct password and mail id."}, "Validation Error")
        )
    }

    const { email, password } = req.body
    
    if(!email || !password){
        return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { message: "Please fill all the fields" },
          "Please fill all the fields"
        )
      );
    }

    const user = await User.findOne({email})

    if(!user){
        return res
        .status(400)
        .json(
            new ApiResponse(400, {message: "User not found"}, "User not found")
        )
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        return res
        .status(400)
        .json(
            new ApiResponse(400, {message: "Invalid password"}, "Invalid password")
        )
    }

    const token = await user.generateAuthToken()

    const options = {
        httpOnly: true, 
        secure: true
    }

    return res
    .status(200)
    .cookie('token', token, options)
    .json(new ApiResponse(200, {user, token, message: "User login succesfull"}, 'User logged in'))
})

const logoutUser = asyncHandler(async (req,res) => {
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
      .status(200)
      .clearCookie("token", options)
      .json(new ApiResponse(200, {message: "User logged out successfully"}, "User logged Out"))
})

const getUserProfile = asyncHandler(async (req,res) => {
  return res
  .status(200)
  .json(new ApiResponse(200, {user: req.user, message: "User profile fetched successfully"}, "User profile fetched successfully"))
})

const getUserSubscriptions = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'subscriptions',
    populate: {
      path: 'product'
    }
  })

  return res
  .status(200)
  .json(new ApiResponse(200, {subscriptions: user.subscriptions, message: "User subscriptions fetched successfully"}, "User subscriptions fetched successfully"))
})

export { registerUser, loginUser, logoutUser, getUserProfile, getUserSubscriptions };

