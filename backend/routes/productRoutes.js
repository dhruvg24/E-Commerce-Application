import express from 'express';
import {createProducts, deleteProduct, getAllProducts, getSingleProduct, updateProduct} from '../controllers/productController.js'
import { verifyUserAuth } from '../middlewares/userAuth.js';
const router=express.Router();

// routes [better way - writing them combinedly]
router.route('/products').get(verifyUserAuth,getAllProducts).post(createProducts);
router.route('/product/:id').put(updateProduct).delete(deleteProduct).get(getSingleProduct);

export default router;