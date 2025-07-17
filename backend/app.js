import express from 'express'
import morgan from 'morgan';
import product from './routes/productRoutes.js'
import user from './routes/userRoutes.js'
import errorHandleMiddleware from './middlewares/error.js'
const app = express();


// middlewares
app.use(morgan('dev'));
app.use(express.json())



// Route
app.use('/api',product);
app.use('/api',user);

app.use(errorHandleMiddleware);
// using after routes will lead to correct error handling.


export default app;
