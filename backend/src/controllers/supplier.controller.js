import { asyncHandler } from "../utils/asyncHandler.js";
import { Supplier } from "../models/supplier.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";

const registerSupplier = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res
        .status(400)
        .json(
            new ApiResponse(400, { err_data: errors.array(), message: "Please enter valid details" }, "Validation Error")
        );
    }
    
    const { username, email, password, phone, suppliername } = req.body;
    
    if (
        [username, email, password, phone, suppliername].some(
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
    
    const existSupplier = await Supplier.findOne({ email });
    
    if (existSupplier) {
        return res
        .status(400)
        .json(
            new ApiResponse(
            400,
            { message: "Supplier already exists" },
            "Supplier already exists"
            )
        );
    }
    
    const supplier = await Supplier.create({
        username,
        email,
        suppliername,
        password,
        phone,
    })

    if(!supplier){
        return res
        .status(500)
        .json(
            new ApiResponse(
            500,
            { message: "Error while creating supplier" },
            "Error while creating supplier"
            )
        );
    }

    const token = await supplier.generateAuthToken();

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(201)
        .cookie('token', token, options)
        .json(
            new ApiResponse(
              201,
              { supplier,
                token,
                message: "Supplier registered successfully" },
              "Supplier registered successfully"
            )
        )
})

const loginSupplier = asyncHandler(async (req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res
        .status(400)
        .json(
            new ApiResponse(400, { err_data: errors.array(), message: "Please enter valid details" }, "Validation Error")
        );
    }

    const {email, password} = req.body

    if(!email || !password){
        return res
        .status(400)
        .json(new ApiResponse(
            400,
            {
                message: "Please enter valid password and email"
            },
            "Please enter valid password and email"
        ))
    }

    const supplier = await Supplier.findOne({email})

    if(!supplier){
        return res
        .status(404)
        .json(new ApiResponse(
            404,
            {
                message: "Supplier not found"
            },
            "Supplier not found"
        ))
    }

    const isMatch = await supplier.isPasswordCorrect(password)

    if(!isMatch){
        return res
        .status(400)
        .json(new ApiResponse(
            400,
            {
                message: "Invalid password"
            },
            "Invalid password"
        ))
    }

    const token = await supplier.generateAuthToken()

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie('token', token, options)
        .json(new ApiResponse(
            200,
            {
                supplier,
                token,
                message: "User logged in successfully"
            },
            "Supplier logged in successfully"
        ))
    
})

const logoutSupplier = asyncHandler(async (req,res) => {
    const options = {
        httpOnly: true,
        secure: true
      }
    
      return res
          .status(200)
          .clearCookie("token", options)
          .json(new ApiResponse(200, {message: "User logged out successfully"}, "Supplier logged Out"))
})

export { registerSupplier, loginSupplier, logoutSupplier }