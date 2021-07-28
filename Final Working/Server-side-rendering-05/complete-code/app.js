// npm i express-mongo-sanitize
// npm i xss
// npm i hpp

const express = require('express');
const morgan = require('morgan');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp');
var cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

// Setting security http header
app.use(helmet());


// 1) Global MIDDLEWARES
// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// Rate limiter(API Limiting)
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

// limit requests from same API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (window milliseconds)
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in an hour!'
});

//  apply to all requests
app.use('/api',limiter);


// Body parser, reading data from body into req.body
// app.use(express.json({ limit: '10kb' }));  // body larger than 10 kb not accepted heavy data
app.use(express.json({ limit:  '10kb'}));  // body larger than 10 kb not accepted heavy data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration', // duration one of them
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'price',
    'difficulty'
  ]
}));



// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');                                                                              
//   next();
// });

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(x);
  console.log(req.cookies);
  // console.log(req.headers);
  next();
});

// 3) ROUTES


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next)=> {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
  // err.status = 'fail';
  // err.statusCode = 404;

  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// Global Error Handling Middleware
// app.use((err, req, res, next)=> {
//   console.log(err.stack)

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
  
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   })
// });

app.use(globalErrorHandler);

module.exports = app;
