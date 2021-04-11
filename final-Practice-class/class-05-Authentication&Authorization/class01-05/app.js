const express = require("express");
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const app = express();
// MIDDLEWARES
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
};

app.use(express.json());
app.use(express.static(`${__dirname}/public`)) 

app.use((req,res,next)=> {
  console.log('Hello Middleware');
  console.log('Hello Middleware', req.originalUrl);
  next();
});

// Create Own Middleware
app.use((req, res, next)=> {
  req.requestTime = new Date().toString();
  next();
  
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use(globalErrorHandler);


// Regular Middleware
app.all('*',(req, res, next)=>{
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}`
  // })
  // next();
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;


  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

//Error Handling Middleware
// app.use((err, req, res, next)=> {

//   console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//   status: err.status,
//   message: err.message
//   });
// })


// START SERVER

module.exports = app;














