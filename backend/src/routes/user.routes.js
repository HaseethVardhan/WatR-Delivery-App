import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controllers.js";
import { body } from "express-validator";

const router = Router();

router.route('/register').post([
    body('email').isEmail().withMessage('Invalid mail'),
    body('firstname').isLength({min: 3}).withMessage('First name should be atleast 3 characters'),
    body('password').isLength({ min: 6}).withMessage('Password should be atleast 6 characters long'),
    body('phone').isMobilePhone().withMessage('Invalid phone number')
], registerUser)

router.route('/login').get([
    body('email').isEmail().withMessage('Invalid mail'),
    body('password').isLength({ min: 6}).withMessage('Password should be atleast 6 characters long')
], loginUser)

export default router