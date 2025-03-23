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
        
        console.log('hi')
        // Find suppliers within 20km radius
        const suppliers1 = await Supplier.find().populate({
            path: 'address',
            options: { strictPopulate: false }
          }).exec();

        // suppliers = JSON.stringify(suppliers, null, 2)

        console.log(suppliers1)

        console.log('now filtering')

        const example = suppliers1.filter(supplier => {
            console.log(supplier.address)
        })

        // Filter suppliers within 20km using Haversine formula
        const nearbySuppliers = suppliers1.filter(supplier => {
            // Earth's radius in km
            const R = 6371;

            const lat1 = parseFloat(address.location.ltd); 
            // console.log(lat1);
            const lon1 = parseFloat(address.location.lng);
            // console.log(lon1);
            // console.log(supplier)
            const lat2 = parseFloat(supplier.address.location.ltd);
            // console.log(lat2);
            const lon2 = parseFloat(supplier.address.location.lng);

            // console.log(lon2);

            // Convert degrees to radians
            const lat1Rad = lat1 * Math.PI/180;
            const lon1Rad = lon1 * Math.PI/180;
            const lat2Rad = lat2 * Math.PI/180; 
            const lon2Rad = lon2 * Math.PI/180;

            // Differences in coordinates
            const dLat = lat2Rad - lat1Rad;
            const dLon = lon2Rad - lon1Rad;

            // Haversine formula
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;

            // Return true if within 20km
            return distance <= 20;
        });

        const suppliers = nearbySuppliers;

        console.log(suppliers)
        const supplierIds = suppliers.map(supplier => supplier._id);
        
        const products = await Product.find({
            productType: type,
            supplierId: { $in: supplierIds }
        }).populate('supplierId', 'name location');
        
        console.log('hi3')
        return res
            .status(200)
            .json(new ApiResponse(200, { products, message: "Products fetched successfully" }, "Products fetched successfully"))
    } catch (error) {
        return res
        .status(400, error, "")
    }
})

export {createProduct, viewSupplierProducts, getProductsByTypeAndLocation}