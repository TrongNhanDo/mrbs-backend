import { Request, Response } from 'express';
import dbConnect from '../../config/poolConnection';

export const getAllParticipants = (req: Request, res: Response) => {
  try {
    dbConnect.getConnection((err, connection) => {
      if (err) throw err;

      connection.query('SELECT * FROM mrbs_participants', (error, rows) => {
        connection.release();
        if (!err) {
          return res.json({
            data: rows || [],
            bizResult: '0'
          });
        } else {
          return res.json({
            errors: err,
            bizResult: '8'
          });
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

export const addParticipant = (req: Request, res: Response) => {
  try {
    dbConnect.getConnection((err, connection) => {
      if (err) throw err;

      const { entry_id, username, create_by, registered } = req.body;
      const query =
        'INSERT INTO mrbs_users (entry_id, username, create_by, registered) VALUES (?,?,?,?)';
      connection.query(
        query,
        [entry_id, username, create_by, registered],
        (err, rows) => {
          connection.release();
          if (!err) {
            return res.json({
              message: 'Add successfully!',
              insertId: rows.insertId || undefined,
              bizResult: '0'
            });
          } else {
            return res.json({
              message: err.message || undefined,
              bizResult: '8'
            });
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

export const updateParticipant = (req: Request, res: Response) => {
  try {
    dbConnect.getConnection((err, connection) => {
      if (err) throw err;

      const { old_id, new_id } = req.body;
      const query =
        'UPDATE mrbs_participants SET entry_id = ? WHERE entry_id = ?';
      connection.query(query, [old_id, new_id], (err) => {
        connection.release();

        if (!err) {
          return res.json({
            message: `Update successfully!`,
            bizResult: '0'
          });
        } else {
          return res.json({
            bizResult: '8',
            errors: err
          });
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

export const deleteParticipant = (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    dbConnect.getConnection((err, connection) => {
      if (err) throw err;

      const query = 'DELETE FROM mrbs_participants WHERE id = ?';
      connection.query(query, [id], (err) => {
        connection.release();
        if (!err) {
          res.json({
            message: 'Delete successfully!',
            bizResult: '0'
          });
        } else {
          res.json({
            bizResult: '8',
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
  getAllParticipants,
  addParticipant,
  updateParticipant,
  deleteParticipant
};
