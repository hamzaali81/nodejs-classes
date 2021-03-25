const express = require("express");
const fs = require("fs");
const app = express();
var morgan = require('morgan'); // HTTP request logger middleware for node.js




// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

app.use((req,res,next)=> {
  console.log('Hello Middleware');
  console.log('Hello Middleware', req.originalUrl);
  next();
})

// Create Own Middleware
app.use((req, res, next)=> {
  req.requestTime = new Date().toString();
  next();
  
})

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
  );
  
  // ROUTE HANDLERS

const getAllTours = (req, res)=> {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    result: tours.length, 
    data: {
      tours
    },
  });
}

const getTour = (req, res)=> {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  // if(id > tours.length){
    if(!tour){
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID'
    })
    }
  // }
}

const createTour = (req,res)=>{
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
 console.log('req.body',req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/tours-simple.json`, JSON.stringify(tours), (err)=> {
      res.status(201).json({
          status: 'success',
          data: {
              tour: newTour
          }
       
       })
  })
//    res.send('Done');
}

const updateTour = (req,res)=> {
  // if(id > tours.length){
    if(req.params.id * 1 > tours.length){
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID'
    })
    }
  // }
res.status(200).json({
  status: 'success',
  data: {
    tour: '<Updated tour here...>'
  }
})
}

const deleteTour = (req, res)=> {
  if(req.params.id * 1 > tours.length){
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
}

const getAllUsers = (req, res)=> {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  })
};

const getUser = (req, res)=> {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  })
};

const createUser = (req, res)=> {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  })
};

const updateUser = (req, res)=> {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  })
};

const deleteUser = (req, res)=> {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  })
};

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id/:y?", getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

// ROUTES

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter
.route('/')
.get(getAllTours)
.post(createTour)

tourRouter
.route('/:id')
.get(getTour)
.patch(updateTour)

// USER RESOURCE
userRouter
.route('/')
.get(getAllUsers)
.post(createUser)

userRouter
.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser)

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
// START SERVER

const port = 8000;
app.listen(port, () => {
  console.log("Server is ready");
});
