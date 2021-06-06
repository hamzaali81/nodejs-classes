const User = require('./../Model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


const filterObj = (obj, ...allowedFields) => {
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el]; 
  })
  return newObj
}



//exports.getAllUsers = catchAsync(async(req, res)=> {
 // const users = await User.find();      
  //SEND RESPONSE
  // res.status(200).json({
    // status: "success",
     // requestedAt: req.requestTime,
    // result: users.length, 
    // data: {
      // users
    // },
  // });
  // });


  exports.updateMe = catchAsync(async(req, res, next) => {
    // 1) Create error if user Posts password data
    if (req.body.password || req.body.passwordConfirm){
      return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400))
    }

    // 2) Update user document
    // body.role: 'admin'

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    
    // 3) Update user document
    const updatedUser = await findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});
    user.name = 'hamza';
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    })
  });
  
  exports.deleteMe = catchAsync(async(req, res, next)=> {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  })
  });

  exports.getUser = (req, res)=> {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    })
  };
  
  exports.createUser = (req, res)=> {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined! Please use /signup instead'
    })
  };
  
  // exports.updateUser = (req, res)=> {
  //   res.status(500).json({
  //     status: 'error',
  //     message: 'This route is not yet defined'
  //   })
  // };
  
  // exports.deleteUser = (req, res)=> {
  //   res.status(500).json({
  //     status: 'error',
  //     message: 'This route is not yet defined'
  //   })
  // };

  // Do NOT update passwords with this! 
  exports.deleteUser = factory.deleteOne(User);
  exports.updateUser = factory.updateOne(User);
  // exports.createUser = factory.createOne(User);
  exports.getUser = factory.getOne(User);
  exports.getAllUsers = factory.getAll(User);
