import { Router } from "express";
import { body } from "express-validator";
import { loginSupplier, registerSupplier, logoutSupplier, getSupplierProfile, getSubscriptions } from "../controllers/supplier.controller.js";
import { verifySupplier } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post([
    body("username").isString().withMessage("Name must be a string"),
    body("suppliername").isString().withMessage("Name must be a string"),
    body("email").isEmail().withMessage("Email must be a valid email"),
    body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
    body("phone")
    .isString()
    .withMessage("Phone must be a string")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must be 10 characters long"),
], registerSupplier);

router.route('/login').post([
    body('email').isEmail().withMessage('Email must be a valid email'),
    body('password').isString().withMessage('Password must be a string').isLength({min: 6}).withMessage('Password must be at least 6 characters long')  
], loginSupplier)

router.route('/logout').get(verifySupplier, logoutSupplier)

router.route('/get-supplier-profile').get(verifySupplier, getSupplierProfile)

router.route('/get-subscriptions').get(verifySupplier, getSubscriptions)

export default router