const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const { findByIdAndUpdate } = require('./../models/userModel');


exports.getOverview = catchAsync(async (req, res)=> {
    // 1)Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template
    // 3) Render that template using tour data from

    res.status(200).render('overview', {
      title: 'All Tours',
      tours
    })
 });

 exports.getTour = catchAsync(async(req, res)=> {
   //1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user'
    });
   
    if(!tour){
      return next(new AppError('There is no tour with that name.', 404))

    }

    //2) Build template
   //3) Render the template using data from 1)
    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour
    })
 });

exports.getLoginForm = (req, res)=>{
  res.status(200).render('login', {
    title: 'Log into your account',
  })

};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  })
};

exports.updateUserData = catchAsync(async(req, res ,next)=> {
  //  console.log(req.body);
  const updatedUser = await User.findByIdAndUpdate(req.user.body, {
    name: req.body.name,
    email: req.body.email
  },{

    new: true,
    runValidators: true
  }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  })

});