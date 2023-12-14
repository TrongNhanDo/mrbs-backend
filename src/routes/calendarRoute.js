const express = require('express');
const calendarController = require('../controllers/calendarController');

const calendarRoute = express.Router();

calendarRoute
  .route('/')
  .get(calendarController.getAllEvents)
  .post(calendarController.addEvent);

calendarRoute
  .route('/get-by-conditions')
  .get(calendarController.getEventByCondition);

module.exports = calendarRoute;
