import { Request, Response } from 'express';
import { MysqlError, PoolConnection } from 'mysql';
import dbConnect from '../../config/poolConnection';
import * as CommonConstants from '../../common/constants';
import * as types from './types';
import { validationResult } from 'express-validator';

const getAllRooms = (req: Request, res: Response) => {
  try {
    dbConnect.getConnection((err: MysqlError, connection: PoolConnection) => {
      if (err) throw err;

      connection.query(
        'SELECT * from mrbs_room ORDER BY id',
        (err: MysqlError, rows) => {
          if (!err) {
            connection.release();
            return res.json({
              data: rows || [],
              bizResult: CommonConstants.BizResult.Success
            });
          } else {
            return res.json({
              errors: err,
              bizResult: CommonConstants.BizResult.Fail
            });
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      errors: error
    });
  }
};

const addRoom = (req: Request, res: Response) => {
  try {
    dbConnect.getConnection((err, connection) => {
      if (err) throw err;

      const params: types.AddRoomProps = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          bizResult: CommonConstants.BizResult.Fail,
          errors: errors.array()
        });
      }

      const query =
        'INSERT INTO mrbs_room (room_name, sort_key, description, capacity, room_admin_email, disabled) VALUES (?,?,?,?,?,?)';
      connection.query(
        query,
        [
          params.room_name,
          params.sort_key,
          params.description,
          params.capacity,
          params.room_admin_email,
          params.disabled || 0
        ],
        (err, rows) => {
          connection.release();
          if (!err) {
            console.log({ added: rows });
            return res.json({
              bizResult: CommonConstants.BizResult.Success,
              errors: []
            });
          }

          return res.json({
            bizResult: CommonConstants.BizResult.Fail,
            errors: []
          });
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const updateRoom = (req: Request, res: Response) => {
  try {
    dbConnect.getConnection((err, connection) => {
      if (err) throw err;

      const params: types.UpdateRoomProps = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          bizResult: CommonConstants.BizResult.Fail,
          errors: errors.array()
        });
      }

      const query =
        'UPDATE mrbs_room SET disabled = ?, room_name = ?, sort_key = ?, description = ?, capacity = ?, room_admin_email = ? WHERE id = ?';
      connection.query(
        query,
        [
          params.disabled,
          params.room_name,
          params.sort_key,
          params.description,
          params.capacity,
          params.room_admin_email,
          params.id
        ],
        (err) => {
          connection.release();
          if (!err) {
            return res.json({
              errors: [],
              bizResult: CommonConstants.BizResult.Success
            });
          } else {
            return res.json({
              bizResult: CommonConstants.BizResult.Fail,
              errors: err
            });
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const deleteRoom = (req: Request, res: Response) => {
  try {
    dbConnect.getConnection((err, connection) => {
      if (err) throw err;

      const params: types.DeleteRoomProps = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          bizResult: CommonConstants.BizResult.Fail,
          errors: errors.array()
        });
      }

      const query = 'DELETE FROM mrbs_room WHERE id = ?';
      connection.query(query, [params.id], (err) => {
        connection.release();
        if (!err) {
          res.json({
            message: 'Delete successfully!',
            bizResult: CommonConstants.BizResult.Success
          });
        } else {
          res.json({
            bizResult: CommonConstants.BizResult.Fail,
            errors: err
          });
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

export default {
  getAllRooms,
  addRoom,
  updateRoom,
  deleteRoom
};
