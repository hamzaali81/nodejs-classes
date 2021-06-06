// review /rating /createdAt /ref to tour /ref to user
// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
//  tour doesnot known about reviews
// cumbersome
reviewSchema.pre(/^find/, function(next){
  this.populate({
    path: 'user',
    select: 'name photo'
  })
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // })
  next();
});

// advance mongoose feature virtual populate

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;

// POST /tour/2312431/reviews  nested routes(parent child relationship)
// POST /tour/2312431/reviews  nested routes(parent child relationship)
// POST /tour/2312431/reviews/2133413  nested routes(parent child relationship)