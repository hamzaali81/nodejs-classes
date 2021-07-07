const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");
const { patch } = require("./userRoutes");

const router = express.Router({ mergeParams: true });

// POST /tour/2f5fd8/reviews
// GET /tour/2f5fd8/reviews
// GET /tour/2f5fd8/reviews/89529

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    // authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(reviewController.deleteReview);

// router
//   .route('/:id')
//   .get(tourController.getTour)
//   .patch(tourController.updateTour)
//   .delete(tourController.deleteTour);

module.exports = router;
