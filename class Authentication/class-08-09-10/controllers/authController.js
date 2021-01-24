//JWT website for match token
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError= require('./../utils/appError');
const { promisify } =  require('util');

const signToken = id =>{
   return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
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
    const dotenv = require('dotenv');

    dotenv.config({ path: '../config.env' });

    const token = signToken(newUser._id);
    res.status(201).json({
        token,
        status: 'success',
        data: {
            user: newUser
        }
    })
  
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
    const token = signToken(user._id);
    res.status(200).json({
        status: 'Success',
        token 
    })
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
 if (currentUser.changesPasswordAfter(decoded.iat)) 
 {
     //issued at
     return next(new AppError('User recently changed password! Please log in again', 401))
 }
 // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
})