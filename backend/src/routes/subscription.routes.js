import { Router } from "express";
import { body } from "express-validator";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { createSubscription } from "../controllers/subscription.controllers.js";

const router = Router()

router.route('/new-subscription').post([
    body('quantity').isNumeric()
],verifyUser, createSubscription)

export default router