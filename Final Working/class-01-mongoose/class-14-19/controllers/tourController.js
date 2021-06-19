const Tour = require('../models/tourModel');


exports.aliasTopTours = (req, res, next)=> {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();

}

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
    console.log('queryObj',queryObj);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el)=> delete queryObj[el])
    
    console.log(req.query, queryObj);
   
    // const query = Tour.find(req.query);

    // Advance filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt| lte|lt)\b/g, (match)=> `$${match}`);
    console.log(JSON.parse(queryStr));

  // gte, lte, gt , lte
  // { difficulty: 'easy', duration: {$gte: 5} }
    let query = Tour.find(JSON.parse(queryStr));
    
    
    // Sorting
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    // sort('price ratingsAverage')
    }
    else {
      query = query.sort('-createdAt')
    }
    
    //3) Field limiting
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      // query = query.select('name duration price')
      query = query.select(fields)
    }
    else {
      query = query.select('-__v'); //except v fields
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=2&limit=10, page 1, 11-20, page 2, 21-30 page 3
    // query = query.skip().limit(10)
    query = query.skip(skip).limit(limit);
    
    if(req.query.page){
      const numTours = await Tour.countDocuments();
      if(skip >= numTours) throw new Error('This page doesnot exist')
    }
    // EXECUTE QUERY
    const tours = await query;
    // query.sort().select().skip().limit()
   

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
