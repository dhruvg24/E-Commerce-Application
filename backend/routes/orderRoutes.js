import express from "express";
import { allMyOrders, createNewOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../controllers/orderController.js";
import { roleBasedAccess, verifyUserAuth } from "../middlewares/userAuth.js";
const router = express.Router();

router.route('/new/order').post(verifyUserAuth,createNewOrder)
router.route('/order/:id').get(verifyUserAuth,getSingleOrder)
router.route('/admin/order/:id').put(verifyUserAuth,roleBasedAccess('admin'), updateOrderStatus).delete(verifyUserAuth,roleBasedAccess('admin'),deleteOrder)
router.route('/admin/orders').get(verifyUserAuth, roleBasedAccess('admin'), getAllOrders);
router.route('/orders/user').get(verifyUserAuth,allMyOrders)
export default router;