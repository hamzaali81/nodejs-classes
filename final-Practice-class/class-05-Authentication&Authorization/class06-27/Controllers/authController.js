//JWT website for match token
// Rate limiter implementing global middleware function (number of ip's too many request) 
// npm install --save express-rate-limit

const User = require('./../Model/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError= require('./../utils/appError');
const sendEmail = require('./../utils/email');
const dotenv = require('dotenv');
const { promisify } =  require('util');
const crypto = require('crypto');

dotenv.config({ path: '../config.env' });

const signToken = id =>{
   return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
       })
}
// const createSendToken = (user, statusCode, res)=>{
//   const token = signToken(user._id);
//   const cookieOptions = {
//     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24* 60 * 60 * 1000),
//     // secure: true,
//     httpOnly: true
// };
// if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
//   res.cookie('jwt', token, cookieOptions)
//   // Remove password from output
//   user.password = undefined;
//   res.status(statusCode).json({
//     status : 'Success',
//     token,
//     data: {
//         user: user
//     }
// })
// } 

const createSendToken = (user, statusCode, res)=> {
    const token = signToken(user._id);

    const cookieOptions ={
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        // secure: true, // https only work
        httpOnly: true
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    // res.cookie('jwt', token, {
    //     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    //     secure: true,
    //     httpOnly: true
    // })
    
    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = catchAsync(async (req, res, next)=>{
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm 
    });

    createSendToken(newUser, 201, res)

    // createSendToken(newUser,201,res)
    // const token = signToken(newUser._id);
    // res.status(201).json({
    //     token,
    //     status: 'success',
    //     data: {
    //         user: newUser
    //     }
    // })
  
});

exports.login = catchAsync(async(req, res, next) =>{ 
    // const email = req.body.email;
    const { email,password } = req.body;
    // 1) Check if email and password exist
    if(!email || !password){
        return next(new AppError('Please provide email and password',400))
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({email}).select('+password');
    // const correct =await user.correctPassword(password, user.password);
    
    // if(!user || !correct){
        if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }
    console.log(user);
     //('password') === '$2b$10$64hqAOvBx9h1OoNPmHByS.gd7duvtgBCdXbanM8M3MI60Hc7PqJ1K'
    //3) If everything is ok token send to client
    createSendToken(user,200,res)
    // const token = signToken(user._id);
    // res.status(200).json({
    //     status: 'Success',
    //     token 
    // })

})


exports.protect = catchAsync(async(req, res, next)=> {
    let token;
    // 1)Getting token and check of it's there 
       if(req.headers.authorization && req.headers.authorization.startsWith('')){
            token = req.headers.authorization.split(' ')[1];
        }
        console.log(token);
        if(!token){
        return new AppError('You are not logged in! Please log in to to get access', 401);
        }
    // 2)Verfication token
  const decoded = (jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
    // 3)Check if user still exists 
  const currentUser = await User.findById(decoded.id);
  if(!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401))
  }  
  // 4)Check if user changed password after token was issued
 if (currentUser.changedPasswordAfter(decoded.iat)) 
 {
     //issued at
     return next(new AppError('User recently changed password! Please log in again', 401))
 }
 // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) =>{
        // roles ['admin','lead-guide'].role='user'
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this section'), 403)
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async(req,res,next)=> {
    // 1) Get User  based on Posted email
    const user = await User.findOne({ email: req.body.email })
    if(!user){
        return next(new AppError('There is no user with email address.', 404))
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        })
        res.status(200).json({
            status: 'Success',
            message: 'Token sent to email'
        })
    }
    catch(err){
        user.createPasswordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email. Try again later'),500)
    } 
});

exports.resetPassword = catchAsync(async(req,res,next)=>{
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user= await User.findOne({
        passwordResetToken: hashedToken, 
        passwordResetExpires: {$gte: Date.now()}
    })

    // 2) If token has not expired, and there is user, set the new password
    if(!user){
        return next(new AppError('Token is invalid or has valid', 400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // 3) Update changePasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(newUser,201,res)
    // const token = signToken(user._id);
    // res.status(200).json({
    //     status: 'Success',
    //     token 
    // })

}) 

exports.updatePassword = catchAsync(async(req,res,next)=> {
    // 1) Get user from collection 
    const user = await User.findById(req.user.id).select('+password');
    // 2)Check if posted current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('Your current password is wrong.', 401))
    }
    // 3)If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    //User.findByIdAndUpdate() will NOT work as  intended!
    // 4) Log user in, send JWT
    createSendToken(user,200,res)
})