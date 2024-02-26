const express = require('express');
const roomController = require('../controllers/roomController');

const roomRoute = express.Router();

roomRoute
  .route('/')
  .get(roomController.getAllRooms)
  .post(roomController.addRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

module.exports = roomRoute;
