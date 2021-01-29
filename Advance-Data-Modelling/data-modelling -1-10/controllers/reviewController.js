const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req,res,next)=>{
    const reviews = await Review.find();
    res.status(201).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
});

exports.createReview = catchAsync(async (req,res,next)=>{
const newReview = await Review.create();
    res.status(201).json({
        status: 'sucsess',
        data: {
            review: newReview
        }
    })
})