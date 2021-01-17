const fs = require('fs');
const express = require('express');

const Tour = require('../models/model');

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

exports.getAllTours= async(req, res)=>{
   try {
    console.log(req.requestTime);
    //Build Query 
    const queryObj = {...req.query}
    console.log(queryObj)
    const excludedFields = ['Page','sort','limit','fields'];
    excludedFields.forEach((el)=> delete queryObj[el]);
    //EXECUTE QUERY
    const tours = await Tour.find(queryObj);  
   res.status(200).json({
       status: 'success',
       reqAt: req.requestTime,
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

