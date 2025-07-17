import handleAsyncErrors from "../middlewares/handleAsyncErrors.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
export const registerUser = handleAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
        public_id: 'temporary public_id',
        url: 'this is temp_url'
    }
  });

  sendToken(user, 200, res);
});


// Login User
export const loginUser = handleAsyncErrors(async(req,res,next)=>{
    const {email, password} = req.body;
    if(!email||!password){
        return next(new HandleError('Email or Password cannot be empty', 400));

    }
    const user = await User.findOne({email}).select('+password');
    // by default in User model select=false, in login we need to show password to user.

    if(!user){
        return next(new HandleError('Invalid Email or Password', 401));
    }

    const isPswdMatch = await user.verifyPassword(password);
    if(!isPswdMatch){
        return next(new HandleError('Invalid email or password', 401));
    }
    
    sendToken(user, 200, res);

})


export const logoutUser = handleAsyncErrors(async(req,res,next)=>{

    // expire token immediately
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        
        httpOnly: true
    });
    // token set to null -> expired
    res.status(200).json({
        success:true,
        message: 'Logged out successfully.'
    })
})