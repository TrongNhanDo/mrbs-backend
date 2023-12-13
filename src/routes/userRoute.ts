import express from 'express';
import userController from '../controllers/user/userController';

const userRoute = express.Router();

userRoute.route('/getUserById/').post(userController.getUserById);

userRoute
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default userRoute;
