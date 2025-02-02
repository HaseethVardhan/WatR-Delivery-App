import { Router } from "express";
import { body } from "express-validator";
import { createAddress, editAddress } from "../controllers/address.controllers.js";

const router = Router();

router.route('/create-address').post([
    body('street').isString().withMessage('Street must be a string'),
    body('city').isString().withMessage('City must be a string'),
    body('state').isString().withMessage('State must be a string'),
    body('country').isString().withMessage('Country must be a string'),
    body('postalCode').isString().withMessage('Postal code must be a string'),
    body('location').isObject().withMessage('Location must be an object'),
    body('formattedAddress').isString().withMessage('Formatted address must be a string'),
    body('placeId').isString().withMessage('Place ID must be a string')
], createAddress)

router.route('/edit-address').post([
    body('street').isString().withMessage('Street must be a string'),
    body('city').isString().withMessage('City must be a string'),
    body('state').isString().withMessage('State must be a string'),
    body('country').isString().withMessage('Country must be a string'),
    body('postalCode').isString().withMessage('Postal code must be a string'),
    body('location').isObject().withMessage('Location must be an object'),
    body('formattedAddress').isString().withMessage('Formatted address must be a string'),
    body('placeId').isString().withMessage('Place ID must be a string')
], editAddress)

export default router