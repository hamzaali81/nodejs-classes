const express = require('express');
const reviewController = require('./../Controllers/reviewController');
const authController = require('./../Controllers/authController');

const router = express.Router({mergeParams: true});

// POST /tour/26381839/reviews
// GET /reviews

// Similar codes also best practices use->(useParam)
router
.route('/')
.get(reviewController.getAllReviews)
.post(
    authController.protect, 
    authController.restrictTo('user') ,
    reviewController.createReview
    );

module.exports = router;
