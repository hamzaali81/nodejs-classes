const express = require("express");
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


const app = express();
// MIDDLEWARES
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));

}
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

app.all('*',(req, res, next)=>{
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl}`
  })
  next();
})
// START SERVER

module.exports = app;
