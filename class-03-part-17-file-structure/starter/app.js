const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoute');
const userRouter = require('./Routes/userRoute');


const app = express();


//1) Middlewares
app.use(morgan('dev'));
app.use(express.json());


app.use((req,res,next)=>{
    console.log('Hello from request middleware');
    next();
})

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})

// app.use((req,res,next)=>{
//     console.log('Hello from request middleware');
//     next();
// })


//3) Routes
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

module.exports = app;