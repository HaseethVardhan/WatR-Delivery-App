import { Router } from "express";
import { body } from "express-validator";
import { verifySupplier, verifyUser } from "../middlewares/auth.middleware.js";
import { createProduct, getProduct, getProductsByTypeAndLocation, viewSupplierProducts } from "../controllers/product.controllers.js";

const router = Router();

router.route('/create').post([
    body('description').isString(),
    body('moq').isNumeric(),
    body('quantity'),
    body('cost').isNumeric()
], verifySupplier, createProduct)

router.route('/view-products').get(verifySupplier, viewSupplierProducts)

router.route('/get-products-available').post( verifyUser, getProductsByTypeAndLocation)

router.route('/get-product').post(verifyUser, getProduct)

export default router