import express from 'express'
import { verifyUserAuth } from '../middlewares/userAuth.js';
import { processPayment, sendAPIKey } from '../controllers/paymentController.js';
const router = express.Router();


router.route('/payment/process').post(verifyUserAuth,processPayment)
router.route('/getKey').get(verifyUserAuth,sendAPIKey)


export default router;