// review / rating /createdAt / ref to tour / ref to user
const  mongoose = require("mongoose");
const Tour = require('./tourModel');


const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must be belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must be belong to a user']
    },
    
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

// Query Middleware

reviewSchema.pre(/^find/, function(next){
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    //   }).populate({
    //    path: 'user',
    //    select: 'name photo'
    //   });
    this.populate({
       path: 'user',
       select: 'name photo'
      });
    next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId){
  const stats = await this.aggregate([
        {
            $match: tourId
        },
        // {
        //     $group: {
        //         _id: '$tour',
        //         nRating: { $sum: 1},
        //         avgRating: { $avg: '$rating' }
        //     }
        // }
    ]);

   
    // reviewSchema.pre('save', function(){
    //     // this points to current review
        
    //     this.constructor.calcAverageRatings(this.tour)
    //     // Review.calcAverageRatings(this.tour)
    //     next()
    // });

    console.log(stats);
    if(stats.length > 0){
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
    
        })
    }
    else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
    
        })
    }
}

reviewSchema.post('save', function(){
    // this points to current review
    
    this.constructor.calcAverageRatings(this.tour)
    // Review.calcAverageRatings(this.tour)
    next()
});

// findByIdAndUpdate
// findByIdAndDelete

// reviewSchema.post(/^findOne/,async function(next){
//    const r= await this.findOne(); 
//    console.log(r);
//    next();
// });

reviewSchema.pre(/^findOne/,async function(next){
    this.r= await this.findOne(); 
   console.log(this.r);
   next();
})
reviewSchema.post(/^findOne/,async function(){
    // this.r= await this.findOne();  does NOT work here, query has already executed
   await this.r.constructor.calcAverageRatings(this.r.tour)
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
