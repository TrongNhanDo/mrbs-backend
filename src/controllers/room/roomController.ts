import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { MysqlError, PoolConnection } from 'mysql';
import dbConnect from '../../config/poolConnection';
import * as CommonConstants from '../../common/constants';
import * as types from './types';
import roomModel from '../../models/room';
import { isEqualObjectId } from '../../common/utils';

const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await roomModel.find().exec();
    if (rooms) {
      return res.json({
        rooms,
        bizResult: CommonConstants.BizResult.Success,
        errors: []
      });
    }

    return res.json({
      bizResult: CommonConstants.BizResult.Fail,
      errors: [{ message: "Server's error" }]
    });
  } catch (error) {
    throw error;
  }
};

const getRoomsPanigate = async (req: Request, res: Response) => {
  try {
    const errValidate = validationResult(req);
    if (!errValidate.isEmpty()) {
      return res.json({
        bizResult: CommonConstants.BizResult.Fail,
        errors: errValidate.array()
      });
    }

    const request: types.GetRoomsPaginate = req.body;
    const allRooms = await roomModel.find().exec();
    const roomsPaginate = await roomModel
      .find()
      .sort({ createdAt: 1 })
      .skip(request.perPage * (request.page || 1) - request.perPage)
      .limit(request.perPage)
      .exec();

    if (
      roomsPaginate &&
      roomsPaginate.length >= 0 &&
      allRooms &&
      allRooms.length >= 0
    ) {
      return res.json({
        countCnt: allRooms.length || 0,
        returnCnt: roomsPaginate.length || 0,
        totalPage: Math.ceil(allRooms.length / request.perPage) || 0,
        users: roomsPaginate,
        bizResult: CommonConstants.BizResult.Success,
        errors: []
      });
    }

    return res.json({
      bizResult: CommonConstants.BizResult.Fail,
      errors: [{ message: "Errors's server" }]
    });
  } catch (error) {
    throw error;
  }
};

const getRoomById = async (req: Request, res: Response) => {
  try {
    const errValidate = validationResult(req);
    if (!errValidate.isEmpty()) {
      return res.json({
        bizResult: CommonConstants.BizResult.Fail,
        errors: errValidate.array()
      });
    }

    const { id } = req.params;
    const room = await roomModel.findById(id).exec();
    if (room) {
      return res.json({
        room,
        bizResult: CommonConstants.BizResult.Success,
        errors: []
      });
    }

    return res.json({
      bizResult: CommonConstants.BizResult.Fail,
      errors: [{ message: 'Room does not exist.' }]
    });
  } catch (error) {
    throw error;
  }
};

// const getAllRooms = (req: Request, res: Response) => {
//   try {
//     dbConnect.getConnection((err: MysqlError, connection: PoolConnection) => {
//       if (err) throw err;

//       connection.query(
//         'SELECT * from mrbs_room ORDER BY id',
//         (err: MysqlError, rows) => {
//           if (!err) {
//             connection.release();
//             return res.json({
//               data: rows || [],
//               bizResult: CommonConstants.BizResult.Success
//             });
//           } else {
//             return res.json({
//               errors: err,
//               bizResult: CommonConstants.BizResult.Fail
//             });
//           }
//         }
//       );
//     });
//   } catch (error) {
//     return res.json({
//       errors: error
//     });
//   }
// };

const addRoom = async (req: Request, res: Response) => {
  try {
    const errValidate = validationResult(req);
    if (!errValidate.isEmpty()) {
      return res.json({
        bizResult: CommonConstants.BizResult.Fail,
        errors: errValidate.array()
      });
    }

    const payload = req.body;
    const duplicate = await roomModel
      .findOne({ room_name: payload.room_name })
      .exec();
    if (duplicate) {
      return res.json({
        errors: [{ message: 'Room_name already existed' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    // create and store new data
    const room = await roomModel.create({
      room_name: payload.room_name,
      sort_key: payload.sort_key,
      description: payload.description,
      capacity: payload.capacity,
      room_admin_email: payload.room_admin_email,
      disabled: payload.disabled
    });
    if (room) {
      return res.json({
        bizResult: CommonConstants.BizResult.Success,
        errors: []
      });
    }

    return res.json({
      errors: [{ message: 'Add new room failed' }],
      bizResult: CommonConstants.BizResult.Fail
    });
  } catch (error) {
    throw error;
  }
};

// const addRoom = (req: Request, res: Response) => {
//   try {
//     dbConnect.getConnection((err, connection) => {
//       if (err) throw err;

//       const params: types.AddRoomProps = req.body;
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json({
//           bizResult: CommonConstants.BizResult.Fail,
//           errors: errors.array()
//         });
//       }

//       const query =
//         'INSERT INTO mrbs_room (room_name, sort_key, description, capacity, room_admin_email, disabled) VALUES (?,?,?,?,?,?)';
//       connection.query(
//         query,
//         [
//           params.room_name,
//           params.sort_key,
//           params.description,
//           params.capacity,
//           params.room_admin_email,
//           params.disabled || 0
//         ],
//         (err, rows) => {
//           connection.release();
//           if (!err) {
//             console.log({ added: rows });
//             return res.json({
//               bizResult: CommonConstants.BizResult.Success,
//               errors: []
//             });
//           }

//           return res.json({
//             bizResult: CommonConstants.BizResult.Fail,
//             errors: []
//           });
//         }
//       );
//     });
//   } catch (error) {
//     throw error;
//   }
// };

const updateRoom = async (req: Request, res: Response) => {
  try {
    const errValidate = validationResult(req);
    if (!errValidate.isEmpty()) {
      return res.json({
        errors: errValidate.array(),
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    const params = req.body;
    const room = await roomModel.findById(params.id).exec();
    if (!room) {
      return res.json({
        errors: [{ message: 'Data not found' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    const duplicate = await roomModel
      .findOne({
        room_name: params.room_name
      })
      .exec();
    if (duplicate && isEqualObjectId(duplicate._id, room._id)) {
      return res.json({
        errors: [{ message: 'Room_name already existed' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    // confirm update data
    const updateData = await roomModel.updateOne(
      {
        _id: params.id
      },
      {
        disabled: params.disabled || room.disabled,
        room_name: params.room_name || room.room_name,
        sort_key: params.sort_key || room.sort_key,
        description: params.description || room.description,
        capacity: params.capacity || room.capacity,
        room_admin_email: params.room_admin_email || room.room_admin_email
      }
    );
    if (updateData) {
      return res.json({
        errors: [],
        bizResult: CommonConstants.BizResult.Success
      });
    } else {
      return res.json({
        errors: [{ message: 'Updated fail' }],
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

// const updateRoom = (req: Request, res: Response) => {
//   try {
//     dbConnect.getConnection((err, connection) => {
//       if (err) throw err;

//       const params: types.UpdateRoomProps = req.body;
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json({
//           bizResult: CommonConstants.BizResult.Fail,
//           errors: errors.array()
//         });
//       }

//       const query =
//         'UPDATE mrbs_room SET disabled = ?, room_name = ?, sort_key = ?, description = ?, capacity = ?, room_admin_email = ? WHERE id = ?';
//       connection.query(
//         query,
//         [
//           params.disabled,
//           params.room_name,
//           params.sort_key,
//           params.description,
//           params.capacity,
//           params.room_admin_email,
//           params.id
//         ],
//         (err) => {
//           connection.release();
//           if (!err) {
//             return res.json({
//               errors: [],
//               bizResult: CommonConstants.BizResult.Success
//             });
//           } else {
//             return res.json({
//               bizResult: CommonConstants.BizResult.Fail,
//               errors: err
//             });
//           }
//         }
//       );
//     });
//   } catch (error) {
//     throw error;
//   }
// };

const deleteRoom = async (req: Request, res: Response) => {
  try {
    const errValidate = validationResult(req);
    if (!errValidate.isEmpty()) {
      return res.json({
        errors: errValidate.array(),
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    const { id } = req.body;
    const room = await roomModel.findById(id).exec();
    if (!room) {
      return res.json({
        errors: [{ message: 'Data not found' }],
        bizResult: CommonConstants.BizResult.Fail
      });
    }

    const result = await room.deleteOne();
    if (result) {
      return res.json({
        errors: [],
        bizResult: CommonConstants.BizResult.Success
      });
    }

    return res.json({
      errors: [{ message: 'Delete fail' }],
      bizResult: CommonConstants.BizResult.Fail
    });
  } catch (error) {
    return res.json({
      errors: error,
      bizResult: CommonConstants.BizResult.Fail
    });
  }
};

// const deleteRoom = (req: Request, res: Response) => {
//   try {
//     dbConnect.getConnection((err, connection) => {
//       if (err) throw err;

//       const params: types.DeleteRoomProps = req.body;
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json({
//           bizResult: CommonConstants.BizResult.Fail,
//           errors: errors.array()
//         });
//       }

//       const query = 'DELETE FROM mrbs_room WHERE id = ?';
//       connection.query(query, [params.id], (err) => {
//         connection.release();
//         if (!err) {
//           res.json({
//             message: 'Delete successfully!',
//             bizResult: CommonConstants.BizResult.Success
//           });
//         } else {
//           res.json({
//             bizResult: CommonConstants.BizResult.Fail,
//             errors: err
//           });
//         }
//       });
//     });
//   } catch (error) {
//     throw error;
//   }
// };

export default {
  getAllRooms,
  getRoomsPanigate,
  getRoomById,
  addRoom,
  updateRoom,
  deleteRoom
};
