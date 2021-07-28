const express = require("express");
const viewsController = require("../controllers/viewController");
const authController = require("../controllers/authController");

const router = express.Router();

// router.get('/', (req,res)=>{
//     res.status(200).render('base', {
//       tour: 'The Forest Hiker',
//       user: 'Hamza'
//     });
//   });

router.use(authController.isLoggedIn);

router.get("/overview", authController.isLoggedIn, viewsController.getOverview);
router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/me", authController.protect, viewsController.getAccount);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
