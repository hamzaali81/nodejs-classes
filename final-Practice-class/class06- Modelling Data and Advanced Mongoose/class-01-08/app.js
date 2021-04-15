// Rate limiter implementing global middleware function (number of ip's too many request) 
// npm install --save express-rate-limit
// npm install helmet --save
// npm install express-mongo-sanitize (milicious code & query protection)
// npm i xss-clean (query protection)
//npm i hpp (prevent parameter pollution)Express middleware to protect against HTTP Parameter Pollution attacks



const express = require("express");
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
var xss = require('xss-clean');
var hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const app = express();
// MIDDLEWARES

// 1) GLOBAL MIDDLEWARES

console.log(process.env.NODE_ENV);

// Set security HTTP headers
app.use(helmet());

// Development requests from same API
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
};

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
// limit request from same api

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in an hour'
});

//  apply to all requests
app.use('/api',limiter);

// Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against Nosql query
// To remove data, use:
app.use(mongoSanitize());

// Data Sanitization against XSS (cross-site-scripting)
app.use(xss())

// HTTP Parameter pollution
app.use(hpp({
  whitelist: ['duration']
}));

//Serving static files
app.use(express.static(`${__dirname}/public`)) 

app.use((req,res,next)=> {
  console.log('Hello Middleware');
  console.log('Hello Middleware', req.originalUrl);
  next();
});

// Create Own Middleware
// Test Middleware
app.use((req, res, next)=> {
  req.requestTime = new Date().toString();
  console.log(req.headers);
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














