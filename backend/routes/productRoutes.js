import express from "express";
import {
  createProducts,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
import { roleBasedAccess, verifyUserAuth } from "../middlewares/userAuth.js";
const router = express.Router();

// routes [better way - writing them combinedly]
router
  .route("/products")
  .get(verifyUserAuth, getAllProducts)
  .post(verifyUserAuth, roleBasedAccess("admin"), createProducts);
router
  .route("/product/:id")
  .put(verifyUserAuth, roleBasedAccess("admin"), updateProduct)
  .delete(verifyUserAuth, roleBasedAccess("admin"), deleteProduct)
  .get(verifyUserAuth, getSingleProduct);

export default router;
