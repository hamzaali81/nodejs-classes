const express = require('express');
const UserController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login)


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