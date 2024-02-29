import express from 'express';
import userController from '../controllers/user/userController';
import {
  validationAddUser,
  validationChangePwd,
  validationDeleteUser,
  validationGetUserById,
  validationGetUsersPanigate,
  validationUpdateUser
} from '../controllers/user/validations';

const userRoute = express.Router();

/** get user by id */
userRoute.get('/:id', validationGetUserById, userController.getUserById);

/** get all users */
userRoute.get('/', userController.getUsers);

/** get all users with panigate */
userRoute.post(
  '/get-users-panigate',
  validationGetUsersPanigate,
  userController.getUsersPanigate
);

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
