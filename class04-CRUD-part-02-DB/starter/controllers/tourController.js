const Tour = require('../Model/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    console.log(req.requestTime);

    //BUILD QUERY
    const queryObj = {...req.query};
    const excludedFields = ['page','sort','limit','fields'];
    excludedFields.forEach(el => delete queryObj[el] )
    
    console.log(req.query,queryObj);
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy'
    // });
    // const tours = await Tour.find().where('duration').equals(4).where('difficulty').equals('easy')
  

    // const tours = await Tour.find(req.query);
    // const tours = await Tour.find(queryObj);
    const query = await Tour.find(queryObj);

    //EXECUTE QUERY
    const tours = await query;
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
