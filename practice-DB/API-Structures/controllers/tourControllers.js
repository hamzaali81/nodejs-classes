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
    //Build Query 
    // const queryObj = {...req.query}
    // console.log('req.query',req.query);
    // console.log(queryObj)
    // const excludedFields = ['page','sort','limit','fields'];
    // excludedFields.forEach((el)=> delete queryObj[el]);
   
    // //1B Advance filtering
    // let queryStr = JSON.stringify(queryObj); //String Method
    // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g ,match => `$${match}`);
    // let query =  Tour.find(JSON.parse(queryStr));
    // console.log(JSON.parse(queryStr));
    
    //2.Sorting
    // //?sort=price,ratingsAverage
    // if(req.query.sort){
    //   // log(req.query.sort)
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);  //sort('price ratingAverage)
    // }else{
    //   query = query.sort('-createdAt');
    // }
    //3.limits
    // if(req.query.fields){
    //   log(req.query.sort)
    //   const fields = req.query.fields.split(',').join(' ');
    //   console.log(fields);
    //   query = query.sort(fields);  //sort('price ratingAverage)
    // }
    // else{
    //   query = query.sort('-v');
    // }
    //4. Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    //  if(req.query.page){
    //    const numTours = await Tour.countDocuments();
    //    if(skip >= numTours) throw new Error('This page doesnot exist');       
    //  }

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