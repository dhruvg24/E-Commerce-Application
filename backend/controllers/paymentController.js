import handleAsyncErrors from "../middlewares/handleAsyncErrors.js";
import { instance } from "../server.js";
// instance of Razorpay
import crypto from 'crypto';
export const processPayment = handleAsyncErrors(async(req,res)=>{
    const options = {
        amount: Number(req.body.amount*100), //in paisa , to convert to rupees mult to 100
        currency:'INR'
    }

    const order = await instance.orders.create(options)
    res.status(200).json({
        success:true,
        order
    })
})

// user needs to have API key to send the payment
export const sendAPIKey = handleAsyncErrors(async(req,res)=>{
    res.status(200).json({
        key:process.env.RAZORPAY_API_KEY
    })
})

// payment verification
export const paymentVerification = handleAsyncErrors(async(req,res)=>{
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;
    // console.log(req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET).update(body.toString()).digest('hex')

    // console.log('Expected signature: ',expectedSignature)
    // console.log('Razorpay signature',razorpay_signature )
    // should match with razorpay_signature.

    const isAuthentic = expectedSignature===razorpay_signature;
    if(isAuthentic){
        return res.status(200).json({
        success:true,
        message:'Payment verified successfully',
        reference:razorpay_payment_id
    })
    }else{
        return res.status(200).json({
        success:false,
        message:'Payment verification failed'
        
    })
    }
    
})