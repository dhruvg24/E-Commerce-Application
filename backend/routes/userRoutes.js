import express from 'express';
import { loginUser, registerUser, logoutUser, requestPasswordReset } from '../controllers/userController.js';
const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/password/forgot').post(requestPasswordReset)

export default router;