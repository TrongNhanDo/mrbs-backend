const express = require('express');
const userController = require('../controllers/userController');

const userRoute = express.Router();

const testMiddleware = (req, res, next) => {
  console.log({ method: req.method });
  next();
};

userRoute.use(testMiddleware);

userRoute
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRoute;
