//JWT website for match token
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError= require('./../utils/appError');

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