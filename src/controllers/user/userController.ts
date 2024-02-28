import { validationResult } from 'express-validator';
import { Request, Response, query } from 'express';
import { MysqlError, PoolConnection } from 'mysql';
import md5 from 'md5';
import dbConnect from '../../config/poolConnection';
import * as CommonTypes from '../../common/types';
import * as Types from './types';
import * as CommonConstants from '../../common/constants';
import userModel from '../../models/user';

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find();
    if (users && users.length >= 0) {
      return res.json({
        users,
        bizResult: CommonConstants.BizResult.Success,
        errors: []
      });
    }

    return res.json({
      bizResult: CommonConstants.BizResult.Fail,
      errors: []
    });
  } catch (error) {
    throw error;
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const users = await userModel.findById(userId);
    if (users) {
      return res.json({
        users,
        bizResult: CommonConstants.BizResult.Success,
        errors: []
      });
    }

    return res.json({
      bizResult: CommonConstants.BizResult.Fail,
      errors: [{ message: 'User does not exist.' }]
    });
  } catch (error) {
    throw error;
  }
};

// const getUserMySql = (req: Request, res: Response) => {
//   try {
//     dbConnect.getConnection((err: MysqlError, connection: PoolConnection) => {
//       if (err) throw err;

//       let queryString = '';
//       const queryParams: number[] = [];

//       const params = req.params;
//       if (params && params.userId) {
//         queryString =
//           'SELECT * from mrbs_users WHERE id = ? GROUP BY level, name ORDER BY level, name';
//         queryParams.push(Number(params.userId));
//       } else {
//         queryString =
//           'SELECT * from mrbs_users GROUP BY level, name ORDER BY level, name';
//       }

//       connection.query(
//         queryString,
//         queryParams,
//         (err: MysqlError, rows: Types.UserProps[]) => {
//           if (!err) {
//             connection.release();
//             const response: Types.ResponseGetAllUsersProps = {
//               returnCnt: rows.length || 0,
//               userList: rows || [],
//               errors: [],
//               bizResult: CommonConstants.BizResult.Success
//             };
//             return res.json(response);
//           } else {
//             const response: CommonTypes.ResponseProps = {
//               errors: [err],
//               bizResult: CommonConstants.BizResult.Fail
//             };
//             return res.json(response);
//           }
//         }
//       );
//     });
//   } catch (error) {
//     throw error;
//   }
// };

const addUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        bizResult: CommonConstants.BizResult.Fail,
        errors: errors.array()
      });
    }

    const duplicate = await userModel.findOne({ name: payload.name }).exec();
    if (duplicate) {
      return res.json({
        errors: [{ message: 'name already existed' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    const userObject = {
      level: payload.level,
      name: payload.name,
      display_name: payload.display_name,
      password_hash: md5(payload.password_hash),
      email: payload.email,
      last_login: payload.last_login
    };
    // create and store new user
    const user = await userModel.create(userObject);
    if (user) {
      return res.json({
        bizResult: CommonConstants.BizResult.Success,
        errors: []
      });
    } else {
      return res.json({
        errors: [{ message: 'Invalid user data received' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }
  } catch (error) {
    return res.json({
      errors: error,
      bizResult: CommonConstants.BizResult.Fail
    });
  }
};

// const addUserMysql = (req: Request, res: Response) => {
//   try {
//     dbConnect.getConnection((err, connection) => {
//       if (err) throw err;

//       const params: Types.AddUserProps = req.body;
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json({
//           bizResult: CommonConstants.BizResult.Fail,
//           errors: errors.array()
//         });
//       }

//       const query =
//         'INSERT INTO mrbs_users (level, name, display_name, password_hash, email, last_login) VALUES (?,?,?,?,?,?)';
//       connection.query(
//         query,
//         [
//           params.level,
//           params.name,
//           params.display_name,
//           params.password_hash,
//           params.email,
//           params.last_login
//         ],
//         (err) => {
//           if (!err) {
//             connection.release();
//             const response: CommonTypes.ResponseProps = {
//               errors: [],
//               bizResult: CommonConstants.BizResult.Success
//             };
//             return res.json(response);
//           } else {
//             connection.rollback();
//             const response: CommonTypes.ResponseProps = {
//               errors: [err],
//               bizResult: CommonConstants.BizResult.Fail
//             };
//             return res.json(response);
//           }
//         }
//       );
//     });
//   } catch (error) {
//     throw error;
//   }
// };

const updateUser = async (req: Request, res: Response) => {
  try {
    const params = req.body;
    const errValidate = validationResult(req);
    if (!errValidate.isEmpty()) {
      return res.json({
        errors: errValidate.array(),
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    const user = await userModel.findById(params.id).exec();
    if (!user) {
      return res.json({
        errors: [{ message: 'User not found' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    const duplicate = await userModel
      .findOne({ name: params.name, id: { $not: { $gt: params.id } } })
      .exec();
    if (duplicate) {
      return res.json({
        errors: [{ message: 'name already existed' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    // confirm update data
    const updateUser = await userModel.updateOne(
      {
        _id: params.id
      },
      {
        level: params.level || user.level,
        name: params.name || user.name,
        display_name: params.display_name || user.display_name,
        email: params.email || user.email
      }
    );
    if (updateUser) {
      return res.json({
        errors: [],
        bizResult: CommonConstants.BizResult.Success
      });
    } else {
      return res.json({
        errors: [{ message: 'Update user fail' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }
  } catch (error) {
    return res.json({
      errors: error,
      bizResult: CommonConstants.BizResult.Fail
    });
  }
};

// const updateUserMysql = (req: Request, res: Response) => {
//   try {
//     dbConnect.getConnection((err, connection) => {
//       if (err) throw err;

//       const params: Types.UpdateUserProps = req.body;
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json({
//           bizResult: CommonConstants.BizResult.Fail,
//           errors: errors.array()
//         });
//       }

//       const query =
//         'UPDATE mrbs_users SET level = ?, display_name = ?, email = ? WHERE id = ?';
//       connection.query(
//         query,
//         [params.level, params.display_name, params.email, params.id],
//         (err) => {
//           if (!err) {
//             connection.release();
//             const response: CommonTypes.ResponseProps = {
//               errors: [],
//               bizResult: CommonConstants.BizResult.Success
//             };
//             return res.json(response);
//           } else {
//             connection.rollback();
//             const response: CommonTypes.ResponseProps = {
//               errors: [err],
//               bizResult: CommonConstants.BizResult.Fail
//             };
//             return res.json(response);
//           }
//         }
//       );
//     });
//   } catch (error) {
//     throw error;
//   }
// };

const changePassword = async (req: Request, res: Response) => {
  try {
    const params = req.body;
    const errValidate = validationResult(req);
    if (!errValidate.isEmpty()) {
      return res.json({
        errors: errValidate.array(),
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    const user = await userModel.findById(params.id).exec();
    if (!user) {
      return res.json({
        errors: [{ message: 'User not found' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    // confirm update data
    const updateUser = await userModel.updateOne(
      {
        _id: params.id
      },
      {
        password_hash: md5(params.password_hash) || user.password_hash
      }
    );
    if (updateUser) {
      return res.json({
        errors: [],
        bizResult: CommonConstants.BizResult.Success
      });
    }

    return res.json({
      errors: [{ message: 'Change password fail' }],
      bizResult: CommonConstants.BizResult.Fail
    });
  } catch (error) {
    return res.json({
      errors: error,
      bizResult: CommonConstants.BizResult.Fail
    });
  }
};

// const changePasswordMysql = (req: Request, res: Response) => {
//   try {
//     dbConnect.getConnection((err, connection) => {
//       if (err) throw err;

//       const params: Types.ChangePwdProps = req.body;
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json({
//           bizResult: CommonConstants.BizResult.Fail,
//           errors: errors.array()
//         });
//       }

//       const query = 'UPDATE mrbs_users SET password_hash = ? WHERE id = ?';
//       connection.query(query, [params.password_hash, params.id], (err) => {
//         if (!err) {
//           connection.release();
//           const response: CommonTypes.ResponseProps = {
//             errors: [],
//             bizResult: CommonConstants.BizResult.Success
//           };
//           return res.json(response);
//         } else {
//           connection.rollback();
//           const response: CommonTypes.ResponseProps = {
//             errors: [err],
//             bizResult: CommonConstants.BizResult.Fail
//           };
//           return res.json(response);
//         }
//       });
//     });
//   } catch (error) {
//     throw error;
//   }
// };

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const errValidate = validationResult(req);
    if (!errValidate.isEmpty()) {
      return res.json({
        errors: errValidate.array(),
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    const user = await userModel.findById(id).exec();
    if (!user) {
      return res.json({
        errors: [{ message: 'User not found' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    const result = await user.deleteOne();
    if (result) {
      return res.json({
        errors: [],
        bizResult: CommonConstants.BizResult.Success
      });
    }

    return res.json({
      errors: [{ message: 'Delete user fail' }],
      bizResult: CommonConstants.BizResult.Fail
    });
  } catch (error) {
    return res.json({
      errors: error,
      bizResult: CommonConstants.BizResult.Fail
    });
  }
};

// const deleteUserMysql = (req: Request, res: Response) => {
//   try {
//     dbConnect.getConnection((err, connection) => {
//       if (err) throw err;

//       const params: Types.DeleteUserProps = req.body;
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json({
//           bizResult: CommonConstants.BizResult.Fail,
//           errors: errors.array()
//         });
//       }

//       const query = 'DELETE FROM mrbs_users WHERE id = ?';
//       connection.query(query, [params.id], (err) => {
//         if (!err) {
//           connection.release();
//           const response: CommonTypes.ResponseProps = {
//             errors: [],
//             bizResult: CommonConstants.BizResult.Success
//           };
//           return res.json(response);
//         } else {
//           connection.rollback();
//           const response: CommonTypes.ResponseProps = {
//             errors: [err],
//             bizResult: CommonConstants.BizResult.Fail
//           };
//           return res.json(response);
//         }
//       });
//     });
//   } catch (error) {
//     throw error;
//   }
// };

export default {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  changePassword,
  deleteUser
};
