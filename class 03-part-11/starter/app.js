const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// app.get('/api/v1/tours',(req,res)=>{
//     res.status(200).json({
//         status: 'success',
//         results: tour.length, 
//         data: {
//             tours
//         }
//     })
// })

// app.get('/api/v1/tours/:id',(req,res)=>{
//     // console.log(req.params);
//     // console.log(req.params.id);
//     const id = req.params.id * 1; //number convert string
//     const tour = tours.find((el)=> el.id === id)
//     // if(id>tours.length){
//         if(!tour){
//        res.status(404).json({
//            success: 'fail',
//            message: 'invalid id'
//        })
//     }

//     res.status(200).json({ 
//         status: 'success',
//         // results: tour.length, 
//         data: {
//          tour
//         }
//     })
// })

// app.post('/api/v1/tours',(req,res)=>{
//     console.log(req.body);

//     const newId = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({id: newId}, req.body);
//     tours.push(newTour);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=>{
//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour: newTour
//         }
//     })
//     })
    
//     // res.status(200).send('Done')

// })

// app.patch('/api/v1/tours/:id',(req,res)=>{
    
//     if(req.params.id * 1> tours.length){
//        res.status(404).json({
//            success: 'fail',
//            message: 'invalid id'
//        })
//     }

//     res.status(200).json({ 
//         status: 'success',
//         // results: tour.length, 
//         data: {
//          tour: '<Update tour successfully>'
//         }
//     })
// })

// app.delete('/api/v1/tours/:id',(req,res)=>{
//     if(req.params.id * 1> tours.length){
//         res.status(404).json({
//             success: 'fail',
//             message: 'invalid id'
//         })
//      }
 
//      res.status(204).json({ 
//          status: 'success',
//          data: null
         
//      })
// })
const getAllTour = (req,res)=>{
    res.status(200).json({
        status: 'success',
        // results: tour.length, 
        data: {
            tours
        }
    })
}

const getTour = (req,res)=>{
    // console.log(req.params);
    // console.log(req.params.id);
    const id = req.params.id * 1; //number convert string
    const tour = tours.find((el)=> el.id === id)
    // if(id>tours.length){
        if(!tour){
       res.status(404).json({
           success: 'fail',
           message: 'invalid id'
       })
    }

    res.status(200).json({ 
        status: 'success',
        // results: tour.length, 
        data: {
         tour
        }
    })
}

const PostTour = (req,res)=>{
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
    
    // res.status(200).send('Done')

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
        // results: tour.length, 
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



// app.get('/api/v1/tours',getAllTour);
// app.post('/api/v1/tours',PostTour);
// app.get('/api/v1/tours/:id',getTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);


app.route('/api/v1/tours').get(getAllTour).post(PostTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

const port = 3000;
app.listen(port,()=>{
console.log(`Server start port ${port}`);
})