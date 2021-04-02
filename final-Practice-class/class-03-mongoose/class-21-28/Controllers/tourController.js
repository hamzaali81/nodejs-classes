const Tour = require('./../Model/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next)=> {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

// class APIFeatures {
//   constructor (query, queryString){
//     this.query = query;
//     this.queryString = queryString;
//   }
//   filter(){
//     const queryObj = {...this.queryString};
//     // const queryObj = {...req.query};
//       const excludedFields = ['page', 'sort', 'limit', 'fields'];
//       excludedFields.forEach((el)=> delete queryObj[el])
      
//       // 1B) Advance filtering
//       console.log(req.query, queryObj);
      
//       let queryStr = JSON.stringify(queryObj);
//      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//       console.log(JSON.parse(queryStr));

     
//       // let query = Tour.find(JSON.parse(queryStr));
      
//       // console.log(req.query);
//       this.query.find(JSON.parse(queryStr));
//       return this;    
//   }

//   sort(){
//     if(this.queryString.sort){
//       query = query.sort(req.query.sort);
//       // sort('price ratingsAverage')
//       const sortBy = this.queryString.sort.split(',').join(' ');
//       console.log(sortBy);
//       query = query.sort(sortBy);
//       // sort('price ratingsAverage')
//     }
//     else {
//       query = query.sort('--createdAt')
//     }
//     return this;
//   }

//   limitFields(){
//     if(this.queryString.fields){
//       const fields = this.queryString.fields.split(',').join(' ');  //join(Array convert in string)
//  // The split() method is used to split a string into an array of substrings, and returns the new array. Tip: If an empty string ("") is used as the separator, the string is split between each character. Note: The split() method does not change the original string.
//       this.query = this.query.select(fields);
//     }
//     else {
//       this.query = this.query.select('-__v')
//      }
//   return this;
//     }
//     paginate(){
//       const page = this.queryString.page * 1 || 1;
//       const limit = this.queryString.limit  * 1 || 100;
//       const skip = (page -1) * limit;
//       this.query = this.query.skip(skip).limit(limit);
//       if(req.query.page){
//         const numTours = await Tour.countDocuments();
//         if(skip >= numTours) throw new Error('This page does not exist'); 
//       }
//       return this;
//     }
// }

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
  
  // Tour.create({}).then()
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