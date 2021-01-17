const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
      maxlength: [],
      minLength: []
    },
    duration:{
type: Number,
required: [true,'A tour must have a duration'],
    },
    maxGroupSize:{
type: Number,
required: [true,'A tour must have a group size']
    },
    difficulty: {
    type: String,
    required: [true,'A tour must have a difficulty'],
    enum: {
      values: ['easy','medium','difficult'],
      message: 'Difficulty: is either easy medium difficult'
    }
    },
    rating: {
      type: Number,
      default: 4.5
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1,'Rating must be above 1.0'],
      max: [5,'Rating must be below 5.0']
    },
    ratingsQuantity:{
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
    type:  Number
    },
    summary:{
      type: String,
      trim: true,
      required: [true,'A tour must have a description']
    },
    description:{
      type: String,
      trim: true
        },
    imageCover:{
      type: String,
      required: [true,'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date]
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
  );
  
  tourSchema.virtual('duration Weeks').get(()=> {return this.duration / 7})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;