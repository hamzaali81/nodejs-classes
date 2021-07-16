// npm i jsonwebtoken --save
const crypto = require('crypto');
const { promisify } = require('util');  // see docs
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

dotenv.config({ path: './../config.env' });

const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

const createSendToken = (user, statusCode, res)=> {
    const token = signToken(user._id);
    
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        // secure: true, // active in https only active in production
        // httpOnly: true  // cross-site scripting
       };
        
       if(process.env.NODE_ENV === 'production') cookieOptions.secure = true

    res.cookie('jwt', token, cookieOptions);
    
    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        token,
        status: 'success',
        data: {
            user
        }
    })
}; 

exports.signup = catchAsync(async(req, res, next)=> {
    const newUser = await User.create(req.body); // User.save (update)
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm
    // });

    // const token = jwt.sign(payload, 'secret', token exires time)
    // const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRES_IN
    // })
    createSendToken(newUser, 201, res)

    // const token = signToken(newUser._id);

    // res.status(201).json({
    //     token,
    //     status: 'success',
    //     data: {
    //         user: newUser
    //     }
    // })
    next();
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
    // console.log(user);

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }
    // 'ham123HAM' === '$2a$12$i65uSWnF6MEkEndQR.J2QuEARSE9s6YjuX/xfG.rnszLb19CnBpH'

    // 3) If everything is ok, send token to client
    createSendToken(user, 200, res);
    // const token = signToken(user._id);
    // res.status(200).json({
    //     status: 'success',
    //     token
    // })
    next()
});

exports.protect = catchAsync(async(req, res, next)=> {
    // 1) Getting token and check of it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
         token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);
    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access', 401))
    };

    // 2) Verification token 
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // return payload
    console.log('decoded', decoded);
    // console.log(decoded); (payload & expires time)

    // 3) Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belonging to this token does no longer exist.', 401))
    }

    // 4) Check if user changed password after the token issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again', 401))
    }
    
    // console.log(currentUser);

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;

    next();
});


exports.restrictTo = (...roles)=> {
    return (req, res, next)=> {
        console.log('req.user',req.user);
       // roles in array ['admin', 'lead-guide']. roles = 'user'
       if(!roles.includes(req.user.role)){

           return next(new AppError('You do not have permission to perform this action', 403)) // 403 forbidden
       }
       next();
   }
};

exports.forgotPassword = catchAsync(async(req, res, next)=> {
    // 1) Get user based on Posted email
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return next(new AppError('There is no user with email address', 404));
    }
    // 2) Generated the random reset token 
    const resetToken = user.createPasswordResetToken();  
    await user.save({ validateBeforeSave: false });
    // await user.save();

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to
    ${resetURL}.\nIf you didn't forget your password, please ignore this email
    `;

    try{

        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
    
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        })
    }

    catch(err){
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email, Try again later!', 500))
    }

    next();
});

exports.resetPassword = catchAsync(async(req, res, next)=> {
    // 1) Get user based on the token
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()} });
    // 2) If token has not expired, and there is user, set the new password
    if(!user){
        return next(new AppError('Token is invalid or has expired', 400));
    };
    
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res)
    // const token = signToken(user._id);
    // res.status(200).json({
    //     status: 'success',
    //     token
    // })
});

exports.updatePassword = catchAsync(async(req, res ,next)=> {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if Posted current password is correct
    if(!(user.correctPassword(req.body.passwordCureent, user.password))){
        return next(new AppError('Your current password is wrong.', 401))
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
     // User.findByIdAndUpdate will NOT work as intended!

    // 1) Log user in, send JWT
    createSendToken(user, 200, res)
    next();
})













