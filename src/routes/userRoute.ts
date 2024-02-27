import express from 'express';
import userController from '../controllers/user/userController';
import { addUserRules } from '../controllers/user/validations';

const userRoute = express.Router();

// get user by id
userRoute.route('/:userId').get(userController.getUsers);
// add new user
userRoute.post('/', addUserRules, userController.addUser);

userRoute
  .route('/')
  // get all users
  .get(userController.getUsers)
  // update user
  .patch(userController.updateUser)
  // delete user
  .delete(userController.deleteUser);

export default userRoute;
