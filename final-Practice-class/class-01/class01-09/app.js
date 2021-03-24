const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", function (req, res) {
  res.status(200).json({
    status: "success",
    result: tours.length, 
    data: {
      tours
    },
  });
});

app.get("/api/v1/tours/:id/:y?", function (req, res) {
  console.log(req.params);
  console.log(req.body);

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
});

app.post('/api/v1/tours', (req,res)=>{
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
}) 

app.patch('/api/v1/tours/:id' , (req,res)=> {
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
})

app.delete('/api/v1/tours/:id', (req, res)=> {
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
})

const port = 8000;
app.listen(port, () => {
  console.log("Server is ready");
});
