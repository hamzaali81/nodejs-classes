const Tour = require('../models/tourModel');

exports.getAllTours = async(req, res) => {
  
  try {
    console.log(req.query);
    
    // 1) Normal way find query
    // const tours = await Tour.find({duration: 5, difficulty: 'easy'});
    
    // 2) Method 02
    // const tours = await Tour.find()
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy')
    ;
    // BUILD QUERY
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el)=> delete queryObj[el])
    
    console.log(req.query, queryObj);
   
    const query = Tour.find(req.query);
   
    // EXECUTE QUERY
    const tours = await query;
    
    res.status(200).json({
      tour: tours.length,
      status: 'success',
      data: {
        tours
      }
    });
  }
  catch (err){
  res.status(401).json({
    message: err
  })
  }
};

exports.getTour = async(req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  }
  catch (err){
  res.status(401).json({
    message: err
  })
  }
};

exports.createTour = async(req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  }
  catch (err){
    res.status(404).json({
      message: err
    })
  }
};

exports.updateTour = async(req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {runValidators: true})
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  }
  catch (err){
    res.status(404).json({
    message: err
    })
  }
};

exports.deleteTour = async(req, res) => {
  try {
   await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null
    });
  }
  catch (err){
    res.status(404).json({
    message: err
    })
  }
};
