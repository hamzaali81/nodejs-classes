const express = require('express');
const tourController = require('./../Controllers/tourController');
const router = express.Router();

router
.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours)

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour);

module.exports = router;
