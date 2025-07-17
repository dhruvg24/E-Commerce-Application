import HandleError from "../utils/handleError.js";
import handleAsyncErrors from "./handleAsyncErrors.js";
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

export const verifyUserAuth = handleAsyncErrors(async (req, res, next)=>{
    const {token} = req.cookies;
    // console.log(token);

    if(!token){
        return next(new HandleError('Authentication is missing, Pls login! ', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id);

    // now user can access
    next();
})


export const roleBasedAccess = (...roles)=>{
    // role can be user/admin/superadmin all grouped as an array    
    return (req,res,next)=>{
        // say req is for 'user' the below condition checks if the for every role!=user -> return error.
        if(!roles.includes(req.user.role)){
            return next(new HandleError(`Role - ${req.user.role} is not allowed to access this resource.`, 403));
        }
        next();
    }
}

