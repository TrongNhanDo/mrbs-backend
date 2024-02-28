import express from 'express';
import roomController from '../controllers/room/roomController';
import {
  validationAddRoom,
  validationDeleteRoom,
  validationUpdateRoom
} from 'controllers/room/validations';

const roomRoute = express.Router();

roomRoute.route('/').get(roomController.getAllRooms);
roomRoute.post('/', validationAddRoom, roomController.addRoom);
roomRoute.patch('/', validationUpdateRoom, roomController.updateRoom);
roomRoute.delete('/', validationDeleteRoom, roomController.deleteRoom);

export default roomRoute;
