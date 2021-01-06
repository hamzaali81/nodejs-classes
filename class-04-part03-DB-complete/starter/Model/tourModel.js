const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
      maxlength: [40,'A tour has must have less than 40 characters'],
      minlength: [10,'A tour has must have more than 10 characters'],
      validate: [validator.isAlpha,'A tour must only contain characters']
    },
    slug: String,
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
    required: [true,'A tour must have a difficulty']
    },
    rating: {
      type: Number,
      default: 4.5
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1,'Rating must be above one 1.0'],
      max: [5,'Rating must be above one 5.0'],
      enum: {
        
      values : ['easy','medium','difficult'],  //validators add
      message: 'Difficulty is either easy medium amd difficult'
      }

    },
    ratingsQuantity:{
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount:{
      type: Number,
      validate: {
       validator: (val)=>{
          return val < this.price //100<20
        }
      },
      message: 'Discount price ({VALUE}) should be below regular price'
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
    startDates: [Date],
    secretTour: {type: Boolean,default: false}
  },{
    toJSON: {
      virtuals: true
    },
    toObject:{
      virtuals: true
    }
  });
  

  //virtual properties
tourSchema.virtual('durationWeeks').get(()=>{ return this.duration / 7})
//1)Document Middleware 
//pre runs before .save() .create()
tourSchema.pre('save',(next)=>{
  // console.log('this',this);
  this.slug= slugify(this.name,{lower: true})
  next();
})

// tourSchema.pre('save',(next)=>{
//   console.log('Will save document');
// })

// tourSchema.post('save',(doc,next)=>{
//   console.log('doc',doc)
//   next();

// })

//Query Middleware
// tourSchema.pre('find',(next)=>{
  tourSchema.pre(/^find/,(next)=>{
this.find({
    secretTour: {$ne: true}
  })
  this.start = Date.now();
  next();
})

tourSchema.post(/^find/,(docs,next)=>{
console.log(`Query ${Date.now() - this.start} milliseconds!`);
next();

})

tourSchema.pre('findOne',(next)=>{
  this.find({
    secretTour: {$ne: true}
  })
  next();
})

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate',(next)=>{
  this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
  console.log(this.pipeline());
  next();
})
//MODEL MIDDLEWARE

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;