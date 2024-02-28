import express from 'express';
import userController from '../controllers/user/userController';
import {
  validationAddUser,
  validationChangePwd,
  validationDeleteUser,
  validationUpdateUser
} from '../controllers/user/validations';

const userRoute = express.Router();

/** get user by id */
userRoute.route('/:userId').get(userController.getUsers);

/** get all users */
userRoute.route('/').get(userController.getUsers);

/** add user */
userRoute.post('/', validationAddUser, userController.addUser);

/** update user */
userRoute.patch('/', validationUpdateUser, userController.updateUser);

/** change password */
userRoute.patch(
  '/change-pwd',
  validationChangePwd,
  userController.changePassword
);

/** delete user */
userRoute.delete('/', validationDeleteUser, userController.deleteUser);

export default userRoute;
