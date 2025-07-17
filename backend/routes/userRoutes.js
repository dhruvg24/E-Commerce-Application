import express from 'express';
import { loginUser, registerUser, logoutUser, requestPasswordReset, resetPassword } from '../controllers/userController.js';
const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/password/forgot').post(requestPasswordReset)
router.route('/reset/:token').post(resetPassword);
// token comes from resetPasswordURL in userController.js (while sending mail to requesting user)

export default router;