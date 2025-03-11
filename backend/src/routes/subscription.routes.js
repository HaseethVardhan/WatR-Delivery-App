import { Router } from "express";
import { body } from "express-validator";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { cancelSubscription, createSubscription } from "../controllers/subscription.controllers.js";

const router = Router()

router.route('/new-subscription').post([
    body('quantity').isNumeric()
],verifyUser, createSubscription)

router.route('/cancel-subscription').post(verifyUser, cancelSubscription)

export default router