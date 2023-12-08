import express from 'express';
import roomController from '../controllers/room/roomController';

const roomRoute = express.Router();

roomRoute
   .route('/')
   .get(roomController.getAllRooms)
   .post(roomController.addRoom)
   .patch(roomController.updateRoom)
   .delete(roomController.deleteRoom);

export default roomRoute;
