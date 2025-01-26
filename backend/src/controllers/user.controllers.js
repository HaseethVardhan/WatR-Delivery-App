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
  }).select("-password");

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

export { registerUser };