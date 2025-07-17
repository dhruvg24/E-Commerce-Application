import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Please enter your name'],
        maxLength: [25, 'Invalid name. Please enter a name with fewer than 25 characters'],
        minLength:[3, 'Name should contain more than 2 characters']
    },
    email: {
        type:String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email!']
    },
    password: {
        type:String, 
        required: [true, 'Please enter your password'],
        minLength: [6, 'Password should be of minimum 6 characters'],
        select:false
        // user should not display password to admin
    },
    avatar: {
        // In product we gave this as array for multiple product images, user should have only single image as Profile.
        public_id: {
            type:String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role: {
        type: String, 
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire:Date
}, {timestamps: true})

userSchema.pre('save', async function(){
    this.password = await bcryptjs.hash(this.password, 10);
    // salt=10
    // if user does not updates the password then this function will hash the hashed password , therefore need to make a condition
    if(!this.isModified('password')){
        return next();
    }
})
// pre('save') - before saving the schema

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

userSchema.methods.verifyPassword = async function(pswd){
    return await bcryptjs.compare(pswd, this.password);
    // this.password - password stored in db.
}

export default mongoose.model('User',userSchema);