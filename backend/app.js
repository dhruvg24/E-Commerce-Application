import express from 'express'
import morgan from 'morgan';
import product from './routes/productRoutes.js'
import user from './routes/userRoutes.js'
import order from './routes/orderRoutes.js'
import payment from './routes/paymentRoutes.js'
import errorHandleMiddleware from './middlewares/error.js'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv'
const app = express();


// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(fileUpload());


// Route
app.use('/api',product);
app.use('/api',user);
app.use('/api',order);
app.use('/api',payment);

app.use(errorHandleMiddleware);

dotenv.config({path:'backend/config/config.env'})



export default app;
