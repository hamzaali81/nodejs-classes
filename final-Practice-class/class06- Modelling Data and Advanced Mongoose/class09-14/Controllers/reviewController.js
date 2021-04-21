const Review = require('./../Model/reviewModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = (async (req, res, next)=> {
   const reviews = await Review.find();

   res.status(200).json({
       status: 'success',
       results: reviews.length,
       data: {
           reviews
       }
   });
   next();
});

exports.createReview = catchAsync(async(req, res, next)=> {
   // Allow nested routes
   if(!req.body.tour) req.body.tour = req.params.tour;
   if(!req.body.user) req.body.user = req.user.id;
   
    const newReview = await Review.create(req.body);
   
   res.status(201).json({
   status: 'success',
   data: {
  review: newReview      
}       
})
next();
})