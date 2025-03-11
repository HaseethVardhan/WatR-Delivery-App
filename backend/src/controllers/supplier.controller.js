import { asyncHandler } from "../utils/asyncHandler.js";
import { Supplier } from "../models/supplier.models.js";
import Address from '../models/address.models.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import axios from 'axios'
import createAddressService from "../services/map.services.js";

const registerSupplier = asyncHandler(async (req, res) => {
    
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res
        .status(400)
        .json(
            new ApiResponse(400, { err_data: errors.array(), message: "Please enter valid details" }, "Validation Error")
        );
    }
    
    const { username, email, password, phone, suppliername, placeString, placeId } = req.body;
    
    
    
    
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




const finalAddress = await createAddressService(placeId, placeString)


const supplier = await Supplier.create({
    username,
    email,
    suppliername,
    password,
    phone,
    address: finalAddress._id
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

const getSupplierProfile = asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, {supplier: req.supplier, message: "Supplier profile fetched successfully"}, "Supplier profile fetched successfully"))
})

const getSubscriptions = asyncHandler(async (req,res) => {
    const supplier = await Supplier.findById(req.supplier._id)
        .populate({
            path: 'subscriptions',
            populate: [
                { path: 'address' },
                { path: 'product' }
            ]
        });
    

    if (!supplier) {
        return res
        .status(404)
        .json(new ApiResponse(404, {message: "Supplier not found"}, "Supplier not found"));
    }


    // Filter out expired subscriptions
    const currentDate = new Date();
    const activeSubscriptions = supplier.subscriptions.filter(sub => 
        new Date(sub.expiryDate) > currentDate
    );

    // Calculate distances and sort
    const supplierLocation = await Address.findById(supplier.address);
    if (!supplierLocation) {
        return res
        .status(404)
        .json(new ApiResponse(404, {message: "Supplier address not found"}, "Supplier address not found"));
    }

    // Add distance to each subscription
    const subscriptionsWithDistance = activeSubscriptions.map(sub => {
        const distance = Math.sqrt(
            Math.pow(supplierLocation.location.ltd - sub.address.location.ltd, 2) +
            Math.pow(supplierLocation.location.lng - sub.address.location.lng, 2)
        );
        return { ...sub.toObject(), distance };
    });

    // Sort by distance
    const sortedSubscriptions = subscriptionsWithDistance.sort((a, b) => 
        a.distance - b.distance
    );

    // Remove distance property before sending response
    const finalSubscriptions = sortedSubscriptions.map(({distance, ...sub}) => sub);

    return res
    .status(200)
    .json(new ApiResponse(200, {subscriptions: finalSubscriptions}, "Subscriptions fetched successfully"));
})

const getCustomers = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.supplier._id)
        .populate({
            path: 'subscriptions',
            populate: [
                {
                    path: 'customer',
                    select: 'username email phone'
                },
                {
                    path: 'product',
                    select: 'productType description quantity cost'
                },
                {
                    path: 'address',
                    select: 'placeString location'
                }
            ]
        });

    if (!supplier) {
        return res
            .status(404)
            .json(new ApiResponse(404, {message: "Supplier not found"}, "Supplier not found"));
    }

    const currentDate = new Date();
    const activeSubscriptions = supplier.subscriptions.filter(sub => 
        new Date(sub.expiryDate) > currentDate
    );

    const customerMap = new Map();
    activeSubscriptions.forEach(sub => {
        if (!customerMap.has(sub.customer._id.toString())) {
            customerMap.set(sub.customer._id.toString(), {
                customerInfo: sub.customer,
                subscriptions: []
            });
        }
        customerMap.get(sub.customer._id.toString()).subscriptions.push({
            product: sub.product,
            quantity: sub.quantity,
            address: sub.address,
            expiryDate: sub.expiryDate,
            cost: sub.cost
        });
    });

    const customerDetails = Array.from(customerMap.values());


    return res
        .status(200)
        .json(new ApiResponse(200, customerDetails, "Customer details fetched successfully"));
})

export { registerSupplier, loginSupplier, logoutSupplier, getSupplierProfile, getSubscriptions, getCustomers }