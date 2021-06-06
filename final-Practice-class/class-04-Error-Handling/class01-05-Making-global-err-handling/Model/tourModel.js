// npm install validator --> validator.js
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40'],
      minlength: [10, 'A tour name must have less or equal than 10'],
    validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    durations:{
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty:{
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values:['easy','medium','difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
    type: Number,
    default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
    type: Number,
    // create own validators
    validate: {
      validator: function(val){
        // This only points to current doc on NEW document creation
        return val < this.price; // 100 < 200
        },
        message: 'Discount price should be below ({VALUE}) regular price'
    }
    },
    summary:{
      type: String,
      trim: true, //white space remove
      required: [true, 'A tour must have a description']
    },
    description:{
      type: String,
      trim: true
      },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean ,
      default: false
    }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);

tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7;
})


// DOCUMENT MIDDLEWARE: runs before .save() and .create() .insertMany()
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, { lower: true});
    next();
});
tourSchema.pre('save', function(next){
   console.log('Will save document....');
   next();
});
tourSchema.pre('save', function(doc,next){
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE
// Document Reading mongoose
tourSchema.pre(/^find/,function(next){
// tourSchema.pre('find',function(next){
   this.find({ secretTour: {$ne: true} })
  
   this.start = Date.now();
   next();
});

tourSchema.post(/^find/,function(next){
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// Aggregation Middleware
tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({ $match: {secretTour: {$ne: true}} })
  console.log(this.pipeline());  // provide aggregate object
  next();
})

// tourSchema.pre('findOne',function(next){
//    this.find({ secretTour: {$ne: true} })
//   next();
// })

// const testTour = new Tour({
//     name: 'The Forest Hiker',
//     rating: 4.7,
//     price: 497
// })

// testTour.save().then((doc) => {
//    console.log(doc);
// }).catch((err)=> {
//     console.log('ERROR :',err);
// })

// const Tour = mongoose.model(Model name, schema)
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

// Assignment Model Middleware
