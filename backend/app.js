import express from 'express'
import morgan from 'morgan';
import product from './routes/productRoutes.js'
import user from './routes/userRoutes.js'
import order from './routes/orderRoutes.js'
import errorHandleMiddleware from './middlewares/error.js'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const app = express();


// middlewares
app.use(morgan('dev'));
app.use(express.json())
app.use(cookieParser());
app.use(fileUpload());


// Route
app.use('/api',product);
app.use('/api',user);
app.use('/api',order);

app.use(errorHandleMiddleware);
// using after routes will lead to correct error handling.


export default app;
