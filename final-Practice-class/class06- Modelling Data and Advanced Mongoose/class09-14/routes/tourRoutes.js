const express = require('express');
const tourController = require('./../Controllers/tourController');
const authController = require('./../Controllers/authController');
// const reviewController = require('./../Controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID)

// POST /tour/2324134/reviews
// GET /tour/2324134/reviews
// GETT /tour/2324134/reviews/378438

// router
// router.route('/:tourId/reviews')
// .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//     );

router.use('/:tourId/reviews', reviewRouter) // mounting a router (implement merge params to access id)
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

// Similar code also bad practices
// Nesting post end points
// router.route('/:tourId/reviews')
// .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//     );

module.exports = router;
