const express = require('express');
const tourController = require('../controllers/tourControllers')
const aliasTopTours = require('../controllers/tourControllers');
const router = express.Router();
// router.param('id',tourController.checkID)
// router.param('id',tourController.checkID)

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours);

router.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour)

router.route('/:id')
.get(tourController.getTours)
.patch(tourController.updateTours)
.delete(tourController.deleteTours);

module.exports = router;