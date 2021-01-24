const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authController');
const aliasTopTours = require('../controllers/tourControllers');
const getTourStats = require('../controllers/tourControllers');
const getMonthlyPlan = require('../controllers/tourControllers');
const router = express.Router();
// router.param('id',tourController.checkID)
// router.param('id',tourController.checkID)

router.route('/top-5-cheap')
.get(tourController.aliasTopTours,tourController.getAllTours);

router.route('/tour-stats')
.get(tourController.getTourStats);

router.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan);

router.route('/')
.get(authController.protect,tourController.getAllTours)
.post(tourController.createTours)

router.route('/:id')
.get(tourController.getTours)
.patch(tourController.updateTours)
.delete(tourController.deleteTours);

module.exports = router;