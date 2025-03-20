import Address from '../models/address.models.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import {User} from '../models/user.models.js';
import axios from 'axios'

const createAddress = asyncHandler(async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(new ApiResponse(400, {errors: errors.array(), message: 'Please ensure that all fields are correctly filled.'}, 'Cannot create address due to validation error'));
        }
    
        const { placeString, placeId } = req.body; 
        
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${placeString}&key=${process.env.GOOGLE_MAPS_API}`
        );
    
        if (response.data.results.length === 0) {
            return res
            .status(400)
            .json(new ApiResponse(400, {message: 'Address not found'}, 'Address not found'))
        }
      
        const { lat, lng } = response.data.results[0].geometry.location;
    
        const address = await Address.create({
            placeString,
            location: {
                ltd: lat,
                lng: lng
            },
            placeId
        })
        res.status(201).json(new ApiResponse(201,{ address, message: 'Address created successfully' }, 'Address created successfully'));
    } catch (error) {
        console.log(error)
    }
  
    

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

const getAutoSuggestions = asyncHandler(async (req, res) => {
    if(!validationResult(req).isEmpty()) {
        return res.status(400).json(new ApiResponse(400, {message: 'Please ensure that all fields are correctly filled.'}, 'Cannot get auto suggestions due to validation error'));
    }

    const { input } = req.body

    if (!input) {
        return res
        .status(400)
        .json(new ApiResponse(400, {}, 'Cannot get suggestions without input'))
    }

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${process.env.GOOGLE_MAPS_API}`
        );

        const suggestions = response.data.predictions
        return res
        .status(200)
        .json(new ApiResponse(200, suggestions, 'Suggestions fetched successfully'))
    } catch (error) {
        console.log(error)
        return res
        .status(500)
        .json(new ApiResponse(500, {message: 'Unable to fetch suggestions right now!'}, 'Cannot fetch suggestions'))
    }
})

const getUserAddress = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.user._id).populate('addresses');

    if(!user) {
        return res
        .status(404)
        .json(new ApiResponse(404, {message: 'User not found'}, 'User not found'))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {addresses: user.addresses}, 'Addresses fetched successfully'))
})


export { createAddress, editAddress, getAutoSuggestions, getUserAddress } 