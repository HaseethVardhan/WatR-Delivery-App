import { Router } from "express";
import { body } from "express-validator";
import {verifyUser} from '../middlewares/auth.middleware.js'
import { createAddress, editAddress, getAutoSuggestions, getUserAddress } from "../controllers/address.controllers.js";

const router = Router();

router.route('/create-address').post([
    body('placeId').isString(),
    body('placeString').isString()
], createAddress)

router.route('/edit-address').post([
], editAddress)

router.route('/get-address-suggestions').post(body('input').isString(),getAutoSuggestions)

router.route('/get-address').get(verifyUser, getUserAddress)

export default router