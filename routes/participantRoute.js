const express = require('express');
const participantController = require('../controllers/participantController');

const participantRoute = express.Router();

participantRoute
   .route('')
   .get(participantController.getAllParticipants)
   .post(participantController.addParticipant)
   .patch(participantController.updateParticipant)
   .delete(participantController.deleteParticipant);

module.exports = participantRoute;
