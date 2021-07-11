const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
// const reviewController = require("../controllers/reviewController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

// alias route

// POST /tour/2f5fd8/reviews
// GET /tour/2f5fd8/reviews
// GET /tour/2f5fd8/reviews/89529
// router
//   .route("/:tourId/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   );

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);
// tours-distance?disctance=233&center=-40,45&unit=mi
// tours-distance/233/center/-40,45/disctance=233/mi

router
   .route('/distances/:latlng/unit/:unit').get(tourController.getDistances)

router
  .route("/")
  .get(tourController.getAllTours)
  // .get(authController.protect, tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
