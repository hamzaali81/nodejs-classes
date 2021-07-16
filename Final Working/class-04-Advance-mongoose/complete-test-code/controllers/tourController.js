const Tour = require("../models/tourModel");
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/appError");
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};



// exports.getAllTours = catchAsync(async (req, res) => {
//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     const tours = await features.query;

//     res.status(200).json({
//       tour: tours.length,
//       status: "success",
//       data: {
//         tours,
//       },
//     });
  
// });

// exports.getTour = catchAsync(async (req, res, next) => {
  // Populate tools special feature in db specially working with relationship
//     const tour = await Tour.findById(req.params.id).populate('reviews');
//     // const tour = await Tour.findById(req.params.id).populate({
//     //   path: 'guides',
//     //   select: '-__v -passwordChangedAt'
//     // });
//     // Tour.findOne({ _id: req.params.id});

//     if(!tour){
//       return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         tour,
//       },
//     });
// });


 

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(200).json({
//     status: "success",
//     data: {
//       tour: newTour,
//     },
//   });
//   next();
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
 
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       // runValidators: true,
//       runValidators: false,
//     });
    
//     if(!tour){
//       return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         tour,
//       },
//     });
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
  
//   const tour=  await Tour.findByIdAndDelete(req.params.id);
  
//   if(!tour){
//     return next(new AppError('No tour found with that ID', 404))
//   }

//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
// });

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, {path: 'reviews'});
exports.createTour = factory.createOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.updateTour = factory.updateOne(Tour);


exports.getTourStats = catchAsync(async (req, res, next)=> {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
  {
    $group: {
      // _id: null,
      // _id: '$difficulty',
      _id: { $toUpper :'$difficulty' },
      // _id: '$ratingsAverage',
      numTours: {$sum: 1},
      numRatings: {$sum: '$ratingsQuantity'},
      avgRating: { $avg: '$ratingsAverage' },
      avgPrice: {$avg: '$price'},
      minPrice: {$min: 'price'},
      maxPrice: {$max: 'price'}
    }
  },
  {
    $sort: {avgPrice: 1} // for ascending
  },
  // {
  //   $match: { _id: {$ne: 'EASY'}}
  // }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats
    }
  });
  next();
});

exports.getMonthlyPlan = catchAsync(async(req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
  {
    $unwind: '$startDates'
  }, 
  {
    $match: {
      startDates: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    }
  },
  {
    $group: {
      _id: {$month: '$startDates'},
      numTourStarts: { $sum: 1},
      tours: { $push: '$name' }
    }
  },
  {
    $addFields: { month: '$_id' }
  },
  {
    $project: {
      _id: 0
    }
  },
  {
   $sort: { numTourStarts: -1 }   
  },
  {
    $limit: 12
  }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan
    }
  });
  next();
});


// router.route('/tours-within/:distance/center/:latlng/unit/:unit', tourController.getToursWithin);
  // tours-within?disctance=233&center=-40,45&unit=mi
  // tours-within/233/center/-40,45/disctance=233/mi
exports.getToursWithin = catchAsync(async(req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
   
  if(!lat || !lng){
    next(new AppError('Please provide latitude and longitude in the format lat, lng', 400))
  };
  
  // console.log(distance, latlng, unit);
   
  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[ lng,lat ], radius] }
   } });

   res.status(200).json({
     status: 'success',
     results: tours.length,
     data: {
       data: tours
     }
   })
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const {  latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001; 

  if(!lat || !lng){
    next(new AppError('Please provide latitude and longitude in the format lat, lng', 400))
  };
 
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    // results: tours.length,
    data: {
      data: distances
    }
  })
});