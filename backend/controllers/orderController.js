import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

import HandleError from "../utils/handleError.js";
import handleAsyncErrors from "../middlewares/handleAsyncErrors.js";

// Create new order
export const createNewOrder = handleAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success:true,
    order
  })
});


// get single order [access to ADMIN]
export const getSingleOrder = handleAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    // whichever user is there will be stored.
    if(!order){
        return next(new HandleError('No order found',404));
    }
    res.status(200).json({
        success:true,
        order
    })

});

// get all my orders
export const allMyOrders = handleAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find({user:req.user._id});
    // all orders of requesting user 
    if(!orders){
        return next(new HandleError('No order found',404));
    }

    res.status(200).json({
        success:true,
        orders
    })

})


// GET ALL ORDERS BY ALL USERS [access to ADMIN ]
export const getAllOrders = handleAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();
    if(!orders){
        return next(new HandleError('No orders', 404));
    }
    let totalAmount = 0;
    orders.forEach(order=>{
        totalAmount= totalAmount+order.totalPrice
    }
    )
    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})


// Update Order Access [Access to ADMIN]
export const updateOrderStatus = handleAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError('No order found',404));
    }
    if(order.orderStatus==='Delivered'){
        return next(new HandleError('This item has been already delivered',404));
    }
    await Promise.all(order.orderItems.map(item=>updateQuantity(item.product, item.quantity)))
    // Concurrent handling
    // check if all the products are delivered to the user, either all should be delivered then it will be resolved else rejected

    // update status
    order.orderStatus=req.body.status;
    if(order.orderStatus=='Delivered'){
        order.deliveredAt=Date.now();
    }

    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        order
    })

})

async function updateQuantity(id, quantity){
    const product = await Product.findById(id);
    if(!product){
        throw new Error('Product not found');
    }
    product.stock = product.stock - quantity;
    // if item is delivered quantity is reduced
    await product.save({validateBeforeSave:false})

}

// DELETE ORDER - [access to ADMIN]
// ORDER CAN ONLY BE DELETED IF DELIVERED.
export const deleteOrder = handleAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError('No order found', 404));
    }
    // may have multiple order but need to delete a single one

    // order cant be deleted if under processing
    if(order.orderStatus!=='Delivered'){
        return next(new HandleError('This order is under processing', 404))
    }
    await Order.deleteOne({_id:req.params.id});

    res.status(200).json({
        success:true,
        message: 'Order deleted successfully.'
    })
})