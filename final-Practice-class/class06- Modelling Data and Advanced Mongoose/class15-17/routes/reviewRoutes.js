const express = require('express');
const reviewController = require('./../Controllers/reviewController');
const authController = require('./../Controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/213442234/reviews
// GET /tour/213442234/reviews
// POST /reviews

router
.route('/')
.get(reviewController.getAllReviews)
.post(
    authController.protect, 
    authController.restrictTo('user') ,
    reviewController.setTourUserIds,
    reviewController.createReview
    );


router.route('/:id').delete(reviewController.deleteReview);
module.exports = router;