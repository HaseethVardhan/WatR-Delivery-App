import { Router } from "express";
import { body } from "express-validator";
import { verifySupplier } from "../middlewares/auth.middleware.js";
import { createProduct, viewSupplierProducts } from "../controllers/product.controllers.js";

const router = Router();

router.route('/create').post([
    body('description').isString(),
    body('moq').isNumeric(),
    body('quantity'),
    body('cost').isNumeric()
], verifySupplier, createProduct)

router.route('/view-products').get(verifySupplier, viewSupplierProducts)

export default router