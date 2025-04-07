import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import { Supplier } from "../models/supplier.models.js";
import {Product} from '../models/product.models.js'
import { Subscription } from "../models/subscription.models.js";

const createSubscription = asyncHandler(async (req, res) => {
    if(!validationResult(req).isEmpty()){
        return res
        .status(400)
        .json(new ApiResponse(400, {message: 'Enter valid quantity'}, 'Enter valid quantity'))
    }

    const {productId, quantity, addressId, startDate, endDate} = req.body

    if (!startDate || !endDate) {
        return res
        .status(400)
        .json(new ApiResponse(400, {message: 'Start and end dates are required'}, 'Start and end dates are required'))
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
        return res
        .status(400)
        .json(new ApiResponse(400, {message: 'End date must be after start date'}, 'End date must be after start date'))
    }

    const product = await Product.findById(productId).populate('supplierId')

    if (!product) {
        return res
        .status(500)
        .json(new ApiResponse(400, {message: 'Something went wrong'}, 'something went wrong'))
    }

    if(product.moq > quantity){
        return res
        .status(400)
        .json(new ApiResponse(400, {message: 'Please ensure minimum quantity'}, 'Please ensure minimum quantity'))
    }

    const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

    const subscription = await Subscription.create({
        customer: req.user._id,
        product: product._id,
        supplier: product.supplierId._id,
        quantity,
        address: addressId,
        cost: product.cost * quantity * daysDifference,
        expiryDate: end
    })

    if (!subscription) {
        return res
        .status(500)
        .json(new ApiResponse(500, null, "Failed to create subscription"))
    }

    await Promise.all([
        req.user.updateOne({ $push: { subscriptions: subscription._id } }),
        product.supplierId.updateOne({ $push: { subscriptions: subscription._id } })
    ]);

    const populatedSubscription = await Subscription.findById(subscription._id)
        .populate('product')
        .populate('supplier')

    return res
    .status(201)
    .json(new ApiResponse(201, populatedSubscription, "Subscription created successfully"))
})

const cancelSubscription = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.body;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
        return res
        .status(404)
        .json(new ApiResponse(404, null, "Subscription not found"));
    }

    if (subscription.customer.toString() !== req.user._id.toString()) {
        return res
        .status(403)
        .json(new ApiResponse(403, null, "Not authorized to cancel this subscription"));
    }

    await Promise.all([
        req.user.updateOne({ $pull: { subscriptions: subscriptionId } }),
        Supplier.findByIdAndUpdate(subscription.supplier, {
            $pull: { subscriptions: subscriptionId }
        }),
        Subscription.findByIdAndDelete(subscriptionId)
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Subscription cancelled successfully"));
})



export {createSubscription, cancelSubscription}