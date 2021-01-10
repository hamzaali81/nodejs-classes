const express = require('express');
const tourController = require('../controllers/tourControllers')

const router = express.Router();
router.param('id',tourController.checkID)

router.route('/')
.get(tourController.getAllTours)
.post(tourController.checkBody,tourController.createTour)

router.route('/:id')
.get(tourController.getTours)

.patch(tourController.updateTours);
delete(tourController.deleteTours)
module.exports = router;