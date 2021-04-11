const express = require('express');
const tourController = require('./../Controllers/tourController');
const authController = require('./../Controllers/authController');

const router = express.Router();

router.route('/top-5-cheap').get(tourController.aliasTopTours ,tourController.getAllTours)

router.route('/tours-stats').get(tourController.getTourStats);
router.route('/monthly-plan').get(tourController.getMonthlyPlan);

router
.route('/')
.get(authController.protect ,tourController.getAllTours)
.post(tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(authController.protect, authController.restrictTo('admin','lead-guide'), tourController.deleteTour)


module.exports = router;