import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Please enter product name'],
        trim : true
    },
    description: {
        type: String, 
        required: [true, 'Please enter Product Description']
    },
    price: {
        type: Number, 
        required: [true, 'Please enter Product Price'],
        maxLength: [7, 'Price cannot exceed 7 digits']
    },
    ratings: {
        type: Number,
        default: 0
    },
    image: [{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category: {
        type: String,
        required: [true, 'Please enter product category']
    },
    stock:{
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5,'Stock cannot exceed 5 digits'],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required: true
            },
            name:{
                type:String,
                required: true
            },
            rating:{
                type:Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})


export default mongoose.model("Product", productSchema);