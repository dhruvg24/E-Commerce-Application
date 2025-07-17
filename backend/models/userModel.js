import mongoose from 'mongoose';
import validator from 'validator';

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

export default mongoose.model('User',userSchema);