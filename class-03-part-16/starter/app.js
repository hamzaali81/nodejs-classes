const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();


//1) Middlewares
app.use(morgan('dev'));
app.use(express.json());


app.use((req,res,next)=>{
    console.log('Hello from request middleware');
    next();
})

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})

// app.use((req,res,next)=>{
//     console.log('Hello from request middleware');
//     next();
// })

//2) Route Handlers
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
const getAllTour = (req,res)=>{
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
     
        data: {
            tours
        }
    })
}

const getTour = (req,res)=>{
    
    const id = req.params.id * 1;
    const tour = tours.find((el)=> el.id === id)
        if(!tour){
       res.status(404).json({
           success: 'fail',
           message: 'invalid id'
       })
    }

    res.status(200).json({ 
        status: 'success',
        data: {
         tour
        }
    })
}

const createTour = (req,res)=>{
    console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=>{
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
    })

}

const updateTour = (req,res)=>{
    
    if(req.params.id * 1> tours.length){
       res.status(404).json({
           success: 'fail',
           message: 'invalid id'
       })
    }
    res.status(200).json({ 
        status: 'success',
        data: {
         tour: '<Update tour successfully>'
        }
    })
}

const deleteTour = (req,res)=>{
    if(req.params.id * 1> tours.length){
        res.status(404).json({
            success: 'fail',
            message: 'invalid id'
        })
     }
 
     res.status(204).json({ 
         status: 'success',
         data: null
         
     })
}

//Users

const getAllUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet define'
    })
};
const createUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet define'
    })
};
const getUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet define'
    })
};
const updateUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet define'
    })
}
const deleteUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet define'
    })
}

//3) Routes
const tourRouter= express.Router();
const userRouter= express.Router();

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

tourRouter.route('/').get(getAllTour).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUser).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// app.route('/api/v1/tours').get(getAllTour).post(createTour);
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

// app.route('/api/v1/users').get(getAllUser).post(createUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);
//4)Server
const port = 3000;
app.listen(port,()=>{
console.log(`Server start port ${port}`);
})