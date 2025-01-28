import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from '../models/user.models.js'
import jwt from "jsonwebtoken"
import { Supplier } from "../models/supplier.models.js";


export const verifyUser = asyncHandler(async (req,res, next) => {
    
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token){
            return res.
            status(400)
            .json(new ApiResponse(400, {message: "Unauthorized User"}, "Unauthorized User"))
        }
    
        const decodedToken = await jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select("-password");
    
        if(!user){
            return res.
            status(400)
            .json(new ApiResponse(400, {message: "Unauthorized User"}, "Unauthorized User"))
        }

    
        req.user = user;
        next();

})

export const verifySupplier = asyncHandler(async (req,res, next) => {
    
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        return res.
        status(400)
        .json(new ApiResponse(400, {message: "Unauthorized User"}, "Unauthorized Supplier"))
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    const supplier = await Supplier.findById(decodedToken?._id).select("-password");

    if(!supplier){
        return res.
        status(400)
        .json(new ApiResponse(400, {message: "Unauthorized User"}, "Unauthorized Supplier"))
    }


    req.supplier = supplier;
    next();

})