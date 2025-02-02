import Address from '../models/address.models.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";

const createAddress = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, {errors: errors.array(), message: 'Please ensure that all fields are correctly filled.'}, 'Cannot create address due to validation error'));
    }
    
    const { street, city, state, country, postalCode, location, formattedAddress, placeId } = req.body;
    const address = new Address({
        street,
        city,
        state,
        country,
        postalCode,
        location,
        formattedAddress,
        placeId
    });
    
    await address.save();
    res.status(201).json(new ApiResponse(201,{ address, message: 'Address created successfully' }, 'Address created successfully'));

})

const editAddress = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, {errors: errors.array(), message: 'Please ensure that all fields are correctly filled.'}, 'Cannot edit address due to validation error'));
    }
    
    const { addressId, street, city, state, country, postalCode, location, formattedAddress, placeId } = req.body;

    const address = await Address.findByIdAndUpdate(addressId, {
        street,
        city,
        state,
        country,
        postalCode,
        location,
        formattedAddress,
        placeId
    }, { new: true });

    if(!address){
        return res
        .status(500)
        .json(new ApiResponse(500, {message: 'Unable to edit address right now!'}, 'Address not found'));
    }

    res.status(201).json(new ApiResponse(201,{ address, message: 'Address edited successfully' }, 'Address edited successfully'));
})

export { createAddress, editAddress }