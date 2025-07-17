
export const sendToken = (user, statusCode, res)=>{
    const token = user.getJWTToken();

    // options for cookies [storing in cookies]
    const options = {
        expires: new Date(Date.now() + process.env.EXPIRE_COOKIE*60*60*1000),
        // milliseconds.
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({sucess: true, user, token});
}