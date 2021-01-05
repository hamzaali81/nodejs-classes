const Tour = require('../Model/tourModel');

exports.aliasTopTours =  (req,res,next) =>{
req.query.limit = '5';
req.query.sort = '-ratingsAverage,price';
req.query.fields= 'name,price,ratingsAverage,summary,difficulty';
next();
}
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    console.log(req.requestTime);

    //BUILD QUERY
    const queryObj = {...req.query};
    const excludedFields = ['page','sort','limit','fields'];
    excludedFields.forEach(el => delete queryObj[el] )
    
    console.log(req.query,queryObj);
    //Mongodb method
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy'
    // });
    // const tours = await Tour.find().where('duration').equals(4).where('difficulty').equals('easy')
  

    // const tours = await Tour.find(req.query);
    // const tours = await Tour.find(queryObj);
    
    // 1) Advance filtering
    //localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lte]=1500
    let queryStr = JSON.stringify(queryObj);
   //gte,gt,lte,lt
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    console.log(JSON.parse(queryStr));

    // const query = await Tour.find(queryObj);
    let query = await Tour.find(JSON.parse(queryStr));


    //{ difficulty: 'easy', duration: {$gte: 5} }
    // { duration: { gte: '5' }, difficulty: 'easy' }
    
    // 2) Sorting
    //localhost:3000/api/v1/tours?sort=price   Ascending order
    //localhost:3000/api/v1/tours?sort=-price  Descending order

    if(req.query.sort){
        // query = query.sort(req.query.sort)
        //sort('price','ratingsAverage')
        const sortBy = req.query.split(',').join(' ');
        query = query.sort(sortBy);
      }else{
        query = query.sort('--createdAt')
      }
    
      //3) Limiting fields
      if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
      }
      else{
      query = query.select('--__v');
      }

      // 4)Pagination
      //localhost:3000/api/v1/tours?page=2&limit=10
      //page 1, 1-20,page 2 11-20
      //localhost:3000/api/v1/tours?page=1&limit=3
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);
      // query = query.skip(2).limit(10);
      if(req.query.page){
        const numTours = await Tour.countDocuments();
        if(skip >= numTours) throw new Error('This page is doesnot exists')
      }
      
    //Aliasing
    //e.g five best cheap cars
    //localhost:3000/api/v1/tours?limit=5&sort=ratingsAverage,price
    //EXECUTE QUERY
    const tours = await query;
    //query.sort().select().skip().limit();

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tours
      }
     
    });
  }
  catch (err){
     res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

exports.getTour = async (req, res) => {
  // console.log(req.params);
  // const id = req.params.id * 1;

  try {
  // const  tours= await Tour.findOne(req.params.id);
  const  tours= await Tour.findById(req.params.id);
  res.status(200).json({
      status: 'success',
      data: {
        tours
      }
    })

    }
    catch (err){
     res.status(404).json({
      status: 'fail', 
      message: err
     })
    }
};

// exports.createTour = (req, res) => {
  
//   const newTour = new Tour({});
//   Tour.save();

//   Tour.create({});

  
//   res.status(201).json({
//     status: 'success'
   
//   });
// };

exports.createTour = async (req, res) => {
  try {

    // const newTour = new Tour({});
    // Tour.save();
  
    console.log('req.body',req.body);
   const newTour= await Tour.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
      tour:  newTour
      }   
    });
  }
  catch(err){
    res.status(404).json({
      status: 'failed',
      // message: err
      message: 'Invalid data sent'
    })
  }
  }

exports.updateTour = async(req, res) => {
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new: true,
      runValidators: true
    });
  res.status(200).json({
    status: 'success',
    data: {
      // tour: '<Updated tour here...>'
      tour
    }
  });
  }
  catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
  
};

exports.deleteTour = async (req, res) => {
  try {
    // const tour = await Tour.findByIdAndDelete(req.params.id)
    await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null
    });

  }
  catch (err){
    res.status(404).json({
      status: 'fail',
      message: err
    })

  }
};
