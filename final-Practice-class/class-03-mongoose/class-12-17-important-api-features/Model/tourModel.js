const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true
    },
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
    required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
    type: Number,
    default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
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
      default: Date.now()
    },
    startDates: [Date]
});

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