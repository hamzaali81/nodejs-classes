const Tour = require('./../Model/tourModel');

 exports.getAllTours = async (req, res)=> {
    console.log(req.requestTime);
    try {
        
      const tours = await Tour.find();
  
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
  
    // const id = req.params.id * 1;
    // const tour = tours.find(el => el.id === id);
    // // if(id > tours.length){
    //   if(!tour){
    //     return res.status(404).json({
    //       status: 'fail',
    //       message: 'Invalid ID'
    //   })
    //   }
    // }
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

    catch (error){
      res.status(404).json({
        status: 'fail',
        message: err
      })  
    }
  }
  
  exports.createTour = async (req,res)=>{
    console.log(req.body);
  //   const newId = tours[tours.length - 1].id + 1;
  //   const newTour = Object.assign({ id: newId }, req.body);
  //  console.log('req.body',req.body);
  //   tours.push(newTour);
  //   fs.writeFile(`${__dirname}/dev-data/tours-simple.json`, JSON.stringify(tours), (err)=> {
  
  //  const newTour = new Tour({})
  //  newTour.save()
  
  // Tour.create({}).then() new+save(combine method)
  try {

    const newTour= await Tour.create(req.body);
     
     res.status(201).json({
               status: 'success',
               data: {
                   tour: newTour
               }
            })
     //    res.send('Done');
  } catch(err) {
   res.status(400).json({
     status: 'fail',
     message: 'Invalid data send'
    //  message: err
   })
  }

  }
  
  exports.updateTour = async (req,res)=> {
    // if(id > tours.length){
      // if(req.params.id * 1 > tours.length){
      //   return res.status(404).json({
      //     status: 'fail',
      //     message: 'Invalid ID'
      // })
      // }
    // }

    try{
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body , {
        new: true,
        runValidators: true
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
    // if(req.params.id * 1 > tours.length){
    //   return res.status(404).json({
    //     status: 'fail',
    //     message: 'Invalid ID'
    //   })
    // }
    try {
    await Tour.findOneAndDelete(req.params.id)
    res.status(200).json({
      status: "success",
      data: null,
    })
    }
    catch(err){
      res.status(404).json({
        status: 'fail',
        message: err
      })
    }
   
  }
