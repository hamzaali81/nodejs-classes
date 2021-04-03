const AppError = require("../utils/appError");


const handleCasterrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err =>{
  const errors = Object.values(err.errors).map((el)=> el.message );
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  console.log(value);
  const message = `Duplicate field value: ${value} Please use another value!`
  return new AppError(message, 400);
} 


const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map((el)=> el.message );

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400); 
}

const sendErrorDev = (err, res)=> {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}

const sendErrorProd = (err, res)=> {
  // Operatinonal, trusted error: send message to client
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      
      });
      // Programming or other unknown error: don't leak error details
  }else{
    // Log error
    console.error('ERROR',err);
    // 2) Send generate message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    })
  }
}

module.exports=((err, req, res, next)=> {

    console.log(err.stack);
  
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if(process.env.NODE_ENV === 'development'){
      // res.status(err.statusCode).json({
        // status: err.status,
        // error: err,
        // message: err.message,
        // stack: err.stack
        sendErrorDev(err, res);
        // });
    }
    else if(process.env.NODE_ENV ==='production'){
      //npm run start:prod
      let error = {...err};
      // res.status(err.statusCode).json({
      //   status: err.status,
      //   message: err.message,
        
      //   });
      if(error.name === 'CastError') error = handleCasterrorDB(error); 
      if(error.code === 11000) error = handleDuplicateFieldsDB(error)
      if(error.name === 'ValidationError') error = handleValidationErrorDB(error)
      sendErrorProd(error, res);
    }

  })
  
  // Error During Development vs Production








