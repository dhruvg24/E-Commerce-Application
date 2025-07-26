import handleAsyncErrors from "../middlewares/handleAsyncErrors.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';
import {v2 as cloudinary} from 'cloudinary'

// register user
export const registerUser = handleAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
    const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: 'avatars', 
        width:150, 
        crop:'scale'
    })
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
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


// get user details
export const getUserDetails = handleAsyncErrors(async(req,res,next)=>{

    // console.log(req.user.id);
    const user = await User.findById(req.user.id);

    // no need to check authorized user as already done by middleware
    res.status(200).json({
        success:true,
        user
    })

});


// Update password
export const updatePassword = handleAsyncErrors(async(req,res,next)=>{
    const {oldPassword,newPassword, confirmPassword} = req.body;
    const user = await User.findById(req.user.id).select('+password');
    // if old password = database stored password then only proceed
    const isPasswordMatch = await user.verifyPassword(oldPassword);
    // verifyPassword function created in usermodel.js

    if(!isPasswordMatch){
        return next(new HandleError('Old password is incorrect',400));
    }

    if(newPassword!==confirmPassword){
        return next(new HandleError('Password doesnot match',400));
    }

    user.password = newPassword;

    await user.save();

    sendToken(user,200,res);
})


// update user profile
export const updateProfile = handleAsyncErrors(async(req,res,next)=>{
    const {name, email, avatar} = req.body;
    const updateUserDetails = {
        name,
        email
    }
    if(avatar!==''){
        const user = await User.findById(req.user.id);
        const imageID = user.avatar.public_id;
        await cloudinary.uploader.destroy(imageID);
        // remove the older image from cloudinary while uploading a new one.

        const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: 'avatars',
            width:150, 
            crop:'scale'
        })
        updateUserDetails.avatar = {
            public_id : myCloud.public_id,
            url: myCloud.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id,updateUserDetails, {
        new:true,
        runValidators:true
    });
    res.status(200).json({
        success:true,
        message: 'Profile updated successfully.',
        user
    })
    
})

// ADMIN - get all users info
export const getUsersList = handleAsyncErrors(async(req,res,next)=>{
    const users = await User.find();
    // getting all the document
    res.status(200).json({
        success:true,
        users
    })
})


// ADMIN - get single user information
export const getSingleUserInfo = handleAsyncErrors(async(req,res,next)=>{
    // console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new HandleError('User doesnot exists with this id', 400));
    }
    if(!user){
        return next(new HandleError('User doesnot exitts!'));
    }

    res.status(200).json({
        success:true,
        user
    })
})


// ADMIN - Changing user Role
export const updateUserRole = handleAsyncErrors(async(req,res,next)=>{
    const {role} = req.body;
    const newUserData = {
        role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new:true,
        runValidators: true
    })

    if(!user){
        return next(new HandleError('User doesnt exist',404))
    }

    res.status(200).json({
        success:true,
        user
    })


})



// ADMIN - Delete User Profile
export const deleteUser= handleAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new HandleError('User doesnot exists',400));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true, 
        message: 'User deleted successfully'
    })

})