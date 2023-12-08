import { Request, Response } from 'express';
import { MysqlError, PoolConnection } from 'mysql';
import dbConnect from '../../config/poolConnection';

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
                     bizResult: '0',
                  });
               } else {
                  return res.json({
                     errors: err,
                     bizResult: '8',
                  });
               }
            }
         );
      });
   } catch (error) {
      return res.json({
         errors: error,
      });
   }
};

const addRoom = (req: Request, res: Response) => {
   try {
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         const params = req.body;
         const query =
            'INSERT INTO mrbs_room (room_name, sort_key, area_id, description, capacity, room_admin_email) VALUES (?,?,?,?,?,?)';
         connection.query(
            query,
            [
               params.room_name,
               params.sort_key,
               params.area_id,
               params.description,
               params.capacity,
               params.room_admin_email,
            ],
            (err, rows) => {
               connection.release();
               if (!err) {
                  return res.json({
                     message: 'Add successfully!',
                     insertId: rows.insertId || undefined,
                     bizResult: '0',
                  });
               } else {
                  return res.json({
                     message: err.message || undefined,
                     bizResult: '8',
                  });
               }
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

         const params = req.body;
         const query =
            'UPDATE mrbs_room SET disabled = ?, area_id = ?, room_name = ?, sort_key = ?, description = ?, capacity = ?, room_admin_email = ?, invalid_types = ? WHERE id = ?';
         connection.query(
            query,
            [
               params.disabled,
               params.area_id,
               params.room_name,
               params.sort_key,
               params.description,
               params.capacity,
               params.room_admin_email,
               params.invalid_types,
               params.id,
            ],
            (err) => {
               connection.release();
               if (!err) {
                  return res.json({
                     message: `Update successfully!`,
                     bizResult: '0',
                  });
               } else {
                  return res.json({
                     bizResult: '8',
                     errors: err,
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
      const { id } = req.body;
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         const query = 'DELETE FROM mrbs_room WHERE id = ?';
         connection.query(query, [id], (err) => {
            connection.release();
            if (!err) {
               res.json({
                  message: 'Delete successfully!',
                  bizResult: '0',
               });
            } else {
               res.json({
                  bizResult: '8',
                  errors: err,
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
   deleteRoom,
};
