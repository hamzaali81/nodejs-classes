const express = require('express');
const tourController = require('./../Controllers/tourController');
const router = express.Router();

router.param('id', tourController.checkID);
// router.param('id', (req, res, next, val)=>{
//     console.log(`The param middleware ${val}`);
//     next();
// })

// Create a checkBody middleware

// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.checkBody,tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour);

module.exports = router;