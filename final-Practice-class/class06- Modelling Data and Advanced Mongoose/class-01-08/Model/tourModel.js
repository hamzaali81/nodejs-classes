// npm install validator --> validator.js
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

// geospatial data
// Geospatial in mongodb
// steps 01: startLocation - location in general

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
    },
    //Geospatial data
    startLocation: { // this object as embedded object
//       To specify GeoJSON data, use an embedded document with:

// a field named type that specifies the GeoJSON object type and
// a field named coordinates that specifies the object's coordinates.

// If specifying latitude and longitude coordinates, list the longitude first and then latitude:

// Valid longitude values are between -180 and 180, both inclusive.
// Valid latitude values are between -90 and 90, both inclusive.
// <field>: { type: <GeoJSON type> , coordinates: <coordinates> }
      type: {
      type: String,
      default: 'Point',
      enum: ['Point']
      },
    coordinates: [Number],
    address: String,
    description: String,
    },
    //Embedding Documents
    locations: [
      {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      day: Number
    }
  ],

  // Modelling Tour Guides Embedding
  // guides: Array,
  
  // Modelling Child Refrencing
  guides: [
    // Populate
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'  // Step 01
    }
  ]
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

tourSchema.pre('save',async function(next){
// Tour guides [user id]
  const guidesPromises = this.guides.map(async id =>await User.findById(id));
 this.guides = await Promise.all(guidesPromises)
  next();
})
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

// guides in populate
tourSchema.pre(/^find/, function(next){
// step 02
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  })
 next();
});


tourSchema.post(/^find/,function(next){
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});


// Aggregation Middleware
tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({ $match: {secretTour: {$ne: true}} })
  console.log(this.pipeline());
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
