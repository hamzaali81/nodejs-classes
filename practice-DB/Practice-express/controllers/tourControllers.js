const fs = require('fs');
const express = require('express');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
// app.use(express.json());


exports.checkID = (req, res, next , val)=>{
    console.log(val);
    if(req.params.id * 1 > tours.length){
      res.status(404).json({
          status: 'failed',
          message: 'Invalid Id'
      })
    }
    next();
}


exports.checkBody = (req, res, next )=>{
    console.log(req.body);
    if(!req.body.name || !req.body.price){
        res.status(404).json({
          status: 'failed!',
          message: 'Missing name or price'
        })
    }
    next();
  
}

exports.getAllTours=(req, res)=>{
    console.log(req.requestTime)
   
   res.status(200).json({
       status: 'success',
       reqAt: req.requestTime,
       data: {
           tours
        }
   })
};

exports.deleteTours=(req, res)=> {
    res.status(204).json({
        status: 'success',
        data: null
    })
}

exports.getTours = (req, res)=>{
    // console.log(req.params);
    const id = req.params.id * 1;
    // // console.log(id);
    const tour = tours.find((el)=> el.id === id)

    // if(id > tours.length){
    //     if(!tour){
    //    res.status(404).json({
    //        status: 'fail',
    //        message: 'Invalid ID'
    //    })
    // }
   
   res.status(200).json({
       status: 'success',
       req: req.requestTime,
       data: {
           tour
       }
   })
};
exports.createTour = (req, res) => {
    // console.log(req.body);
  
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
  
    tours.push(newTour);
  
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      err => {
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour
          }
        });
      }
    );
  };

exports.updateTours=(req, res)=>{
    // console.log(tour)
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Update tour'
        }
    })
};

