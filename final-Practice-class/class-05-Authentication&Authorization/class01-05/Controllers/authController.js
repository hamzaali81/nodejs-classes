// Authentication is very hard to get right
// Extra careful  for this part of application user's data is at stack and the trust in the company who runs the application is at stake as well
// Anyone is simply register as an admin

// npm i jsonwebtoken --save

const User = require('./../Model/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken'); 
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
// const signToken = id => {
//     return jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     })
// }

exports.signup = catchAsync(async (req, res, next)=> {
    // const newUser = await User.create(req.body);

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })


    const token = signToken(newUser._id)

    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRES_IN
    // })

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});


exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist

    if(!email || !password){
    next(new AppError('Please provide email and password!', 400));
    }
    
    // 2) Check if user exists && password is correct 
    const user =await User.findOne({ // password check if in order is correctemail
   email
    }).select('+password');

    const correct =await user.correctPassword(password, user.password);
     
    if(!user || !correct){
        return next(new AppError('Incorrect email or password', 401))
    }

  console.log(user);   
   // password === '$2a$12$jRJrQGEptugqI385XembL.LZ5GXHP6dojG5Twp3rHPXe90rsAIkIm'

 // const user = User.findOne({ // password not contain
    //     email
    // })


    // 3) If everything ok, send token to client

    const token = signToken(user._id);
    // const token = '';
    res.status(200).json({
        status: 'success',
        token

    })
})

// {
//     "name": "hamzaali81",
//     "email": "hamza@gmail.com",
//     "password": "pass123456",
//     "passwordConfirm": "pass123456"
// }