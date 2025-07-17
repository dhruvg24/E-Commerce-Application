import express from 'express'
import morgan from 'morgan';
import product from './routes/productRoutes.js'
import errorHandleMiddleware from './middlewares/error.js'
const app = express();


// middlewares
app.use(morgan('dev'));
app.use(express.json())
app.use(errorHandleMiddleware);
// Route
app.use('/api',product);

export default app;
