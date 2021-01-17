const express = require('express');
const tourController = require('../controllers/tourControllers')

const router = express.Router();
// router.param('id',tourController.checkID)
// router.param('id',tourController.checkID)
router.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour)

router.route('/:id')
.get(tourController.getTours)

.patch(tourController.updateTours)
.delete(tourController.deleteTours);
module.exports = router;