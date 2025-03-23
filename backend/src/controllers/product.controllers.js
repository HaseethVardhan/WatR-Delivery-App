import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import Address from '../models/address.models.js'
import { Supplier } from "../models/supplier.models.js";

const createProduct = asyncHandler(async (req,res) => {
    if(!validationResult(req).isEmpty()){
        return res
        .status(400)
        .json(new ApiResponse(400, {message: "Fill all the fields properly"}, "Fill all the fields properly"));
    }

    const {description, moq, quantity, type, cost} = req.body

    const product = await Product.create({
        productType: type,
        description,
        minimumOrderQuantity: moq,
        quantity,
        cost,
        supplierId: req.supplier._id
    })

    if(!product){
        return res
        .status(500)
        .json(new ApiResponse(500, {message: "Something went wrong while creating product"}, "Something went wrong while creating product"));
    }

    return res
        .status(201)
        .json(new ApiResponse(201, {product,message: "Product successfully created"}, "Product successfully created"));
})

const viewSupplierProducts = asyncHandler(async (req,res) => {
    const products = await Product.find({supplierId: req.supplier._id})

    if(!products){
        return res
        .status(500)
        .json(new ApiResponse(500, {message: "Something went wrong while fetching products"}, "Something went wrong while fetching products"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {products,message: "Products successfully fetched"}, "Products successfully fetched"));
})

const getProductsByTypeAndLocation = asyncHandler(async (req, res) => {
    try {
        const { type, addressId } = req.body;
    
        if (!type || !addressId) {
            return res
                .status(400)
                .json(new ApiResponse(400, { message: "Type and address are required" }, "Type and address are required"));
        }
    
        const address = await Address.findById(addressId).select('location');
        if (!address) {
            return res
                .status(404)
                .json(new ApiResponse(404, { message: "Address not found" }, "Address not found"));
        }
        
    // Get all suppliers
    let suppliers = await Supplier.find().populate('address');

    // Earth's radius in km
    const EARTH_RADIUS = 6371;
    const MAX_DISTANCE = 20; // 20km radius

    // Filter suppliers within 20km
    const nearbySuppliers = suppliers.filter(supplier => {
        // Skip suppliers without address/location
        if (!supplier.address?.location) return false;
        
        // Convert coordinates to radians
        const lat1 = address.location.ltd * Math.PI/180;
        const lon1 = address.location.lng * Math.PI/180;
        const lat2 = supplier.address.location.ltd * Math.PI/180; 
        const lon2 = supplier.address.location.lng * Math.PI/180;

        // Haversine formula components
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1) * Math.cos(lat2) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        // Calculate distance
        const distance = EARTH_RADIUS * c;

        return distance <= MAX_DISTANCE;
    });

    suppliers = nearbySuppliers;

        
        const supplierIds = suppliers.map(supplier => supplier._id);
        
        const products = await Product.find({
            productType: type,
            supplierId: { $in: supplierIds }
        }).populate({
            path: 'supplierId',
            model: 'Supplier',
            select: 'suppliername address',
            populate: {
                path: 'address',
                model: 'Address',
                select: 'location'
            }
        });
        
        return res
            .status(200)
            .json(new ApiResponse(200, { products, message: "Products fetched successfully" }, "Products fetched successfully"))
    } catch (error) {
        return res
        .status(400, error, "")
    }
})

export {createProduct, viewSupplierProducts, getProductsByTypeAndLocation}