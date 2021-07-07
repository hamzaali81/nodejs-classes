const  mongoose = require("mongoose");
var slugify = require('slugify');
const User = require('./userModel');


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour must have more or equal then 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
    },
    difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum :{
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
    }
    },
    rating: {
        type: Number,
        default: 4.5
    },
    ratingsAverage: {
    type: Number,
    default: 0,
    min: [1 , 'Rating must be above 1.0'],
    max: [5 , 'Rating must be below 5.0']
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
        validate: function(val){
            // this only points to current doc on NEW document creation
        return val < this.price; // 100 < 200
        },
        message: 'Discount price {{VALUE}} should be below regular price'

    },
    summary :{
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
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
    // Schema type object
    secretTour: {
        type: Boolean,
        default: false
    },
    // Embedded Object
    startLocation: {
       // GeoJSON
       type: {
           // Schema type options
            type: String,
            default: 'Point'
       },

       coordinates: [Number],
       address: String,
       description: String
    },
    locations: [
        // Embedded document
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    // Embedding tour(users ids)
    // guides: Array

    // Refrencing         -
    guides: [
    //     // ptocesss populating
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    // Solution 01
    // reviews: [
    //     {
    //         type: mongoose.Schema.ObjectId,
    //         ref: 'Review'
    //     }
    // ]
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeeks').get(function () {
    // not part of database
    return this.duration / 7
});

// Solution 02 (virtual populate) Advance mongoose feature
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'

})

// Document Middleware: runs before .save() and .create()
tourSchema.pre('save', function(next){
   console.log('this',this);
   this.slug = slugify(this.name, {lower: true})
   next(); 
});

// connect embedding
// tourSchema.pre('save',async function(next) {
//    const guidesPromises = this.guides.map(async (id)=> await User.findById(id))
//    this.guides = await Promise.all(guidesPromises);
//     next(); 
// })

// child refrencing

tourSchema.pre('save', function(next){
   console.log('Document will save!!!')
   next();
});
tourSchema.post('save', function(doc, next){
   console.log(doc);
   next();
});

// Query Middleware
tourSchema.pre(/^find/, function(next){
// tourSchema.pre('find', function(next){
    this.find({ secretTour: {$ne: true} });
    this.start = Date.now();
    next();
});


tourSchema.pre(/^find/, function(next){
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
      });
    next();
});

tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds`)   
    // console.log(docs);
   next();
})

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({ $match: {secretTour: {$ne: true}} })
    console.log(this.pipeline()); // current aggregation object
    next();
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;














