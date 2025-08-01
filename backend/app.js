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
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve all static files
app.use(express.static(path.join(__dirname,'../frontend/dist')));
app.get("/{*any}",(_,res)=>{
    res.sendFile(path.resolve(__dirname,'../frontend/dist/index.html'))
});

app.use(errorHandleMiddleware);

// if(process.env.NODE_ENV!=='PRODUCTION'){
//     dotenv.config({path:'backend/config/config.env'})
// }




export default app;
