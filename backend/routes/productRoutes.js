import express from "express";
import {
  createOrUpdateReviewForProduct,
  createProducts,
  deleteProduct,
  deleteReview,
  getAdminProducts,
  getAllProducts,
  getProductReviews,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
import { roleBasedAccess, verifyUserAuth } from "../middlewares/userAuth.js";
const router = express.Router();

// routes [better way - writing them combinedly]
router.route("/products").get(getAllProducts);

router
  .route("/admin/products")
  .get(verifyUserAuth, roleBasedAccess("admin"), getAdminProducts);

router
  .route("/admin/product/create")
  .post(verifyUserAuth, roleBasedAccess("admin"), createProducts);
router
  .route("/admin/product/:id")
  .put(verifyUserAuth, roleBasedAccess("admin"), updateProduct)
  .delete(verifyUserAuth, roleBasedAccess("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct);

router.route("/review").put(verifyUserAuth, createOrUpdateReviewForProduct);

router.route("/reviews").get(getProductReviews).delete(verifyUserAuth, deleteReview)
export default router;
