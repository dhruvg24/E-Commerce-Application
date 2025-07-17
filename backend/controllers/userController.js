import handleAsyncErrors from "../middlewares/handleAsyncErrors.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';

// register user
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

// logout user
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


// forgot password
export const requestPasswordReset=handleAsyncErrors(async(req,res,next)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return next(new HandleError('User does not exists',400));
    }
    let resetToken;
    try{
        resetToken = user.generatePasswordResetToken();
        // console.log(resetToken);
        await user.save(
            {validateBeforeSave: false}
            // need not validate the fields again before saving the data.[as mentioned in user model]
        )
    }catch(err){
        // console.error(err);
        return next(new HandleError('Could not save reset token pls try again later',500));
    }

    const resetPasswordURL = `http://localhost/api/reset/${resetToken}`;
    // console.log(resetPasswordURL);

    const mailContent = `Use the following link to reset your password: ${resetPasswordURL}. \n\n This link will get expired in 30 minutes. \n\n If you didn't requested a password reset, kindly ignore this message.`

    try{
        // will send the mail
        await sendEmail({
            // as entered by user
            email: user.email,
            subject: 'Password reset request',
            mailContent
        })
        res.status(200).json({
            success:true,
            message:`Email is sent to ${user.email} successfully.`
        })
    }catch(err){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave: false})
        return next(new HandleError('Email could not be sent, pls try again later', 500))
    }


})


// reset password [after user gets mail]
export const resetPassword = handleAsyncErrors(async(req,res,next)=>{
    // console.log(req.params.token);
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    // hashing the received token for password reset
    // console.log(resetPasswordToken)
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
            $gt: Date.now()
            // if time of expire is greater than current time then possible to reset the password
        }

    })
    // 30 minutes expiry time - 1 o clock - curr time, expire: 1:30 
    // 1:30>1:15 allowed....

    if(!user){
        // either token is expired or invalid
        return next(new HandleError('Reset password token is invalid or has been expired' , 400));
    }

    const {password, confirmPassword} = req.body;

    if(password!==confirmPassword){
        return next(new HandleError('Password doesnot match' , 400));
    }

    user.password = password;
    // set the new password into user
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user,200,res);

    

})