const express = require('express');
const UserController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login)

router.post('/forgotPassword', authController.forgotPassword);
// router.post('/resetPassword', authController.resetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword)
router.patch('/updateMe',authController.protect,UserController.updateMe)

router
 .route('/')
 .get(UserController.getAllUsers)
 .post(UserController.createUser)

 router
 .route('/:id')
 .get(UserController.getUser)
 .patch(UserController.updateUser)
 .delete(UserController.deleteUser)

 module.exports = router;