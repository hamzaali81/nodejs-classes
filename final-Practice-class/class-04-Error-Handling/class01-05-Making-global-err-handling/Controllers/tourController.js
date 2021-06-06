const Tour = require('./../Model/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next)=> {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}


exports.getAllTours = async (req, res)=> {
    console.log(req.requestTime);
    try {

      // EXECUTE QUERY
      const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
      const tours = await features.query;      
      //SEND RESPONSE
      res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        result: tours.length, 
        data: {
          tours
        },
      });
    }

    catch (error){
      res.status(400).json({
        status: 'fail',
        // message: error
        message: 'Invalid Id'
      })
    }
  }
  
  exports.getTour = async(req, res)=> {
    console.log(req.params);

    try{
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })  
  }

    catch (err){
      res.status(404).json({
        status: 'fail',
        message: err
      })  
    }
  }
  
  exports.createTour = async (req,res)=>{
    console.log(req.body);
  try {

    const newTour= await Tour.create(req.body);
     
     res.status(201).json({
               status: 'success',
               data: {
                   tour: newTour
               }
            })
  } catch(err) {
   res.status(400).json({
     status: 'fail',
     message: 'Invalid data send'
    //  message: err
   })
  }

  }
  
  exports.updateTour = async (req,res)=> {
   
    try{
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body , {
        new: true,
        runValidators: true
        // runValidators: false
      })
      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      })
    }
    catch(err){
      res.status(404).json({
        status: 'fail',
        message: err
      })
    }
  }
  
  exports.deleteTour = async(req, res)=> {
   
    try {
      await Tour.findByIdAndDelete(req.params.id)
      res.status(200).json({
        status: "success",
        data: null,
      });
    }catch(err){
      res.status(404).json({
        status: 'fail',
        message: err
      })
    }
  }

// Aggregation pipeline(mongodb feature see docs) docs-> mongodb manual-> Reference -> operators
  exports.getTourStats = async (req, res)=>{
    try {
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
    } catch (err){
        res.status(404).json({
          status: 'fail',
          message: err
        })
    }
  }


  // Aggregation pipeline unwinding and projecting
  exports.getMonthlyPlan = async(req, res)=> {
    try {
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
            $group: {  // work like accumulator
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
    }
  

    catch(err){
      res.status()
    }
  }
