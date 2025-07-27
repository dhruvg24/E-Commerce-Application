import handleAsyncErrors from "../middlewares/handleAsyncErrors.js";
import { instance } from "../server.js";
// instance of Razorpay

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