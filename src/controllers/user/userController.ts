import { Request, Response } from 'express';
import { MysqlError, PoolConnection } from 'mysql';
import dbConnect from '../../config/poolConnection';
import * as CommonTypes from '../../common/types';
import * as Types from './types';
import * as Constants from '../../common/constants';

const getAllUsers = (req: Request, res: Response) => {
  try {
    dbConnect.getConnection((err: MysqlError, connection: PoolConnection) => {
      if (err) throw err;

      connection.query(
        'SELECT * from mrbs_users GROUP BY level, name ORDER BY level, name',
        (err: MysqlError, rows: Types.UserProps[]) => {
          if (!err) {
            connection.release();
            const response: Types.ResponseGetAllUsersProps = {
              returnCnt: rows.length || 0,
              userList: rows || [],
              errors: [],
              bizResult: Constants.BizResult.Success,
            };
            return res.json(response);
          } else {
            const response: CommonTypes.ResponseProps = {
              errors: [err],
              bizResult: Constants.BizResult.Fail,
            };
            return res.json(response);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const getUserById = (req: Request, res: Response) => {
  try {
    const params: { id: number } = req.body;
    dbConnect.getConnection((err: MysqlError, connection: PoolConnection) => {
      if (err) throw err;

      const searchQuery = 'SELECT * from mrbs_users WHERE id = ?';
      connection.query(
        searchQuery,
        [params.id],
        (err: MysqlError, rows: Types.UserProps[]) => {
          if (!err) {
            connection.release();
            const response: Types.ResponseGetAllUsersProps = {
              returnCnt: rows.length || 0,
              userList: rows || [],
              errors: [],
              bizResult: Constants.BizResult.Success,
            };
            return res.json(response);
          } else {
            const response: CommonTypes.ResponseProps = {
              errors: [err],
              bizResult: Constants.BizResult.Fail,
            };
            return res.json(response);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const addUser = (req: Request, res: Response) => {
  try {
    dbConnect.getConnection((err, connection) => {
      if (err) throw err;

      const params: Types.AddUserProps = req.body;
      req.body;
      const query =
        'INSERT INTO mrbs_users (level, name, display_name, password_hash, email, last_login) VALUES (?,?,?,?,?,?)';
      connection.query(
        query,
        [
          params.level,
          params.name,
          params.display_name,
          params.password_hash,
          params.email,
          params.last_login,
        ],
        (err) => {
          if (!err) {
            connection.release();
            const response: CommonTypes.ResponseProps = {
              errors: [],
              bizResult: Constants.BizResult.Success,
            };
            return res.json(response);
          } else {
            connection.rollback();
            const response: CommonTypes.ResponseProps = {
              errors: [err],
              bizResult: Constants.BizResult.Fail,
            };
            return res.json(response);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const updateUser = (req: Request, res: Response) => {
  try {
    dbConnect.getConnection((err, connection) => {
      if (err) throw err;

      const params: Types.UpdateUserProps = req.body;
      const query =
        'UPDATE mrbs_users SET level = ?, display_name = ?, password_hash = ?, email = ? WHERE id = ?';
      connection.query(
        query,
        [
          params.level,
          params.display_name,
          params.password_hash,
          params.email,
          params.id,
        ],
        (err) => {
          if (!err) {
            connection.release();
            const response: CommonTypes.ResponseProps = {
              errors: [],
              bizResult: Constants.BizResult.Success,
            };
            return res.json(response);
          } else {
            connection.rollback();
            const response: CommonTypes.ResponseProps = {
              errors: [err],
              bizResult: Constants.BizResult.Fail,
            };
            return res.json(response);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const deleteUser = (req: Request, res: Response) => {
  try {
    const params: Types.DeleteUserProps = req.body;
    dbConnect.getConnection((err, connection) => {
      if (err) throw err;

      const query = 'DELETE FROM mrbs_users WHERE id = ?';
      connection.query(query, [params.id], (err) => {
        if (!err) {
          connection.release();
          const response: CommonTypes.ResponseProps = {
            errors: [],
            bizResult: Constants.BizResult.Success,
          };
          return res.json(response);
        } else {
          connection.rollback();
          const response: CommonTypes.ResponseProps = {
            errors: [err],
            bizResult: Constants.BizResult.Fail,
          };
          return res.json(response);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

export default {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getUserById,
};
