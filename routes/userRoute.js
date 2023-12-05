const express = require('express');
const userController = require('../controllers/userController');

const userRoute = express.Router();

userRoute
   .route('/')
   .get(userController.getAllUsers)
   .post(userController.addUser)
   .delete(userController.deleteUser);

module.exports = userRoute;
