const express = require('express');
const calendarController = require('../controllers/calendarController');

const userRoute = express.Router();

userRoute.route('/').post(calendarController.listenCalendarEvent);

module.exports = userRoute;
