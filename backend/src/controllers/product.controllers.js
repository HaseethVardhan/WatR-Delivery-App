import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";

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

export {createProduct, viewSupplierProducts}