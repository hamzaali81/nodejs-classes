const fs = require('fs');
const express = require('express');
const Tour = require('../models/model');
// const { query } = require('express');
// const { countDocuments } = require('../models/model');
const APIFeatures = require('../utils/apiFeatures');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
// app.use(express.json());

// exports.checkID = (req, res, next , val)=>{
//     console.log(val);
//     if(req.params.id * 1 > tours.length){
//       res.status(404).json({
//           status: 'failed',
//           message: 'Invalid Id'
//       })
//     }
//     next();
// }


// exports.checkBody = (req, res, next )=>{
//     console.log(req.body);
//     if(!req.body.name || !req.body.price){
//         res.status(404).json({
//           status: 'failed!',
//           message: 'Missing name or price'
//         })
//     }
//     next();
  
// }

exports.aliasTopTours = (req, res, next)=>{
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  // req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}


exports.getAllTours= async(req, res)=>{
   try {
    console.log(req.requestTime);
    //EXECUTE QUERY 
  // const features = new APIFeatures(queryString,req.query);
  const features = new APIFeatures(Tour.find(),req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();

  const tours = await features.query; 

   res.status(200).json({
       results: tours.length,
       status: 'success',
       reqAt: req.requestTime,
       data: 
       {
           tours
        }
   })
   }
   catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
   }
   
};

exports.deleteTours = async(req, res)=> {
  try{
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: null
  })
  }
  catch(err){
     res.status(404).json({
       status: 'fail',
       message: err
     })
  }
   
}

exports.getTours = async(req, res)=>{
  try{
   const tours = await Tour.findById(req.params.id);

   res.status(200).json({
    status: 'success',
    req: req.requestTime,
    data: {
        tours
    }
})
  }
    catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
   }
    // console.log(req.params);
    // const id = req.params.id * 1;
    // // // console.log(id);
    // const tour = tours.find((el)=> el.id === id)

    // if(id > tours.length){
    //     if(!tour){
    //    res.status(404).json({
    //        status: 'fail',
    //        message: 'Invalid ID'
    //    })
    // }
   

};
exports.createTour = async(req, res) => {
    // console.log(req.body);
    try{
      // const newTours = new Tour({})
      // newTours.save();
        
     
      const newTours = await Tour.create(req.body);
      console.log(newTours);
      res.status(201).json({
              status: 'success',
              data: newTours
              
              }) 
   } 
  
   catch(err){
     res.status(404).json({
       status: 'fail',
       message: err
     })
     
    } 
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);
  
    // tours.push(newTour);
  
    // fs.writeFile(
    //   `${__dirname}/dev-data/data/tours-simple.json`,
    //   JSON.stringify(tours),
    //   err => {
    //     res.status(201).json({
    //       status: 'success',
    //       data: {
    //         tour: newTour
    //       }
    //     });
    //   }
    // );
  };

exports.updateTours= async(req, res)=>{
  try{
    const tours = await Tour.findByIdAndUpdate(req.params.id,req.body,{
      runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Update tour'
        }
    })
  }
  catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
    
   } 
    // console.log(tour)
  
};


exports.getTourStats = async(req, res)=>{
  // try {
  // const stats =await Tour.aggregate([
  //   {
  //   $match: {ratingsAverage: {$gte: 4.5}},
  //   $group: {
  //     id: {$toUpper: '$difficulty'},
  //     avgPrice: {$avg: '$price'},
  //     maxPrice: {$max: '$price'},
  //     minPrice: {$min: '$price'}
  //   },
  //   $sort:{
  //     avdPrice: 1 //ascendind order
  //   },
  //   $match: {
  //     _id: {$ne: 'EASY'}
  //   }
    
  // }
  // ])
  // }
  // catch (err){
  //  res.status(404).json({
  //    status: 'fail',
  //    message: err
  //  })
  // }
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}

exports.getMonthlyPlan = async(req,res)=>{
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
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
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
      status: 'success',
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}