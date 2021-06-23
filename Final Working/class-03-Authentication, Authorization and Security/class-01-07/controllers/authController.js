// npm i jsonwebtoken --save
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AppError = require('../utils/appError');

dotenv.config({ path: './../config.env' });

const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async(req, res, next)=> {
    // const newUser = await User.create(req.body); // User.save (update)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    // const token = jwt.sign(payload, 'secret', token exires time)
    // const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRES_IN
    // })

    const token = signToken(newUser._id);

    res.status(201).json({
        token,
        status: 'success',
        data: {
            user: newUser
        }
    })
    // next()
});

exports.login = catchAsync(async(req, res, next)=> {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if(!email || !password){ 
        next(new AppError('Please provide email and password!', 400))

    }

    // 2) Check if user exist && password is correct

    const user = await User.findOne({ email}).select('+password');
    // const correct =  await user.correctPassword(password, user.password)
    console.log(user);

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }
    // 'ham123HAM' === '$2a$12$i65uSWnF6MEkEndQR.J2QuEARSE9s6YjuX/xfG.rnszLb19CnBpH'

    // 3) If everything is ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})