import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getUsersList,
  getSingleUserInfo,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";
import { roleBasedAccess, verifyUserAuth } from "../middlewares/userAuth.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/password/forgot").post(requestPasswordReset);
router.route("/reset/:token").post(resetPassword);
// token comes from resetPasswordURL in userController.js (while sending mail to requesting user)
router.route("/profile").post(verifyUserAuth, getUserDetails);
router.route("/password/update").post(verifyUserAuth, updatePassword);
router.route("/profile/update").post(verifyUserAuth, updateProfile);
router
  .route("/admin/users")
  .get(verifyUserAuth, roleBasedAccess("admin"), getUsersList);
router
  .route("/admin/user/:id")
  .get(verifyUserAuth, roleBasedAccess("admin"), getSingleUserInfo)
  .put(verifyUserAuth, roleBasedAccess("admin"), updateUserRole)
  .delete(verifyUserAuth, roleBasedAccess('admin'),deleteUser)

export default router;


