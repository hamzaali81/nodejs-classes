const app = require('../app');
const AppError = require('../utils/appError');
const Tour = require('./../Model/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next)=> {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}


// exports.getAllTours = catchAsync(async(req, res, next)=> {
   // console.log(req.requestTime);
   // const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
     // const tours = await features.query;      
      //SEND RESPONSE
     // res.status(200).json({
       // status: "success",
       // requestedAt: req.requestTime,
       // result: tours.length, 
       // data: {
         // tours
       // },
     // });
//  })
  
  // exports.getTour = catchAsync(async(req, res, next)=> {
  //   console.log(req.params);
  //   // const tour = await Tour.findById(req.params.id);
  //   // Populating (populate filled up actual guides)
  //   const tour =  await Tour.findById(req.params.id).populate('reviews')
  //   // .populated({ // populate
  //   // path:  'guides',
  //   // select: '-__v -passwordChangedAt'

  //   // });
  //   // const tour = await (await Tour.findById(req.params.id)).populated('guides');
  //   // Tour.findOne({ _id: req.params.id })
    
  //   if(!tour){
  //     return next(new AppError('No tour found with that ID', 404))
  //   }
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       tour
  //     }
  //   })  
  // })

  // exports.createTour = catchAsync(async (req,res, next)=>{
  
  //   const newTour= await Tour.create(req.body);
     
  //   res.status(201).json({
  //             status: 'success',
  //             data: {
  //                 tour: newTour
  //             }
  //          })

  // })
  
  // exports.updateTour = catchAsync(async(req,res, next)=> {
  //     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body , {
  //       new: true,
  //       runValidators: true
  //     });
  //     if(!tour){
  //       return next(new AppError('No tour found with that ID', 404))
  //     }
  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         tour
  //       }
  //     })

  // })
  exports.getAllTours = factory.getAll(Tour);
  exports.deleteTour = factory.deleteOne(Tour);
  exports.updateTour = factory.updateOne(Tour);
  exports.createTour = factory.createOne(Tour);
  exports.getTour = factory.getOne(Tour, { path: 'reviews' });
  // exports.deleteTour = catchAsync(async(req, res,next)=> {
   
  //   const tour=  await Tour.findByIdAndDelete(req.params.id)
  //   if(!tour){
  //     return next(new AppError('No tour found with that ID', 404))
  //   }
  //     res.status(200).json({
  //       status: "success",
  //       data: null,
  //     }); 
  // });

// Aggregation pipeline(mongodb feature see docs) docs-> mongodb manual-> Reference -> operators
  exports.getTourStats = catchAsync(async(req, res, next)=>{
      const stats = await Tour.aggregate([
             {
               $match: { ratingsAverage: { $gte: 4.5 } }
             },
             {
               $group: {
                //  _id: null,
                 _id: {$toUpper :'$ratingsAverage'},
                //  _id: '$difficulty',
                 numTours: { $sum: 1 },
                 numRatings: {$sum: '$ratingsQuantity'},
                 avgRatings: { $avg: '$ratingsAverage' },
                 avgPrice: { $avg: '$price' },
                 minPrice: {$min: '$price'},
                 maxPrice: { $max: '$price' }
               }
             },
             {
               $sort: { avgPrice: 1 }
             },
             {
               $match: { _id: {$ne: 'EASY'} }
             }
      ])
        
      res.status(200).json({
        status: 'success',
        data: {
          stats
        }
      })
      })


  // Aggregation pipeline unwinding and projecting
  exports.getMonthlyPlan = catchAsync(async(req, res, next)=> {
    
       const year = req.params.year * 1; // 2021
       const plan = await Tour.aggregate([
         {
           $unwind: '$startDates'
          },
          {
            $match: {
              startDates: {
                $gte: new Date(`${year}-01-01`),
                $gte: new Date(`${year}-12-31`)
              }
            }
            },
            {
            $group: {
              _id: { $month: '$startDates' },
              numTourStarts: { $sum: 1 },
              tours: {$push: '$name'}
            }
          }, 
            {
              $addField: { month: '$_id'}
            },
            {
              $project: {
                _id: 0
              }
            },
            {
              $sort: {numTourStarts: -1}
            },
            {
              $limit: 6
            }
       ]);

       res.status(200).json({
         status: 'success',
         data: {
           plan
         }
       })
    
  
  })
