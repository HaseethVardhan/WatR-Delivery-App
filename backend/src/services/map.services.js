import Address from '../models/address.models.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import axios from 'axios'

const createAddressService = async (placeId, placeString) => {
    try {
        
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${placeString}&key=${process.env.GOOGLE_MAPS_API}`
        );
    
        if (response.data.results.length === 0) {
            return []
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
        
        return address
    } catch (error) {
        console.log(error)
    }
  
    

}

export default createAddressService