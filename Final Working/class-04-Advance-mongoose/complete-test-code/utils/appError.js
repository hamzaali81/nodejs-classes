class AppError extends Error{
    constructor(message, statusCode){
        super(message); //parent class

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        this.isOperational = true;  // third party packages error, modules error

        Error.captureStackTrace(this, this.constructor)
    }
};

module.exports = AppError;