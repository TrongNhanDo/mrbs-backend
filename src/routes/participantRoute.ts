import express from 'express';
import participantController from '../controllers/participant/participantController';

const participantRoute = express.Router();

participantRoute
   .route('')
   .get(participantController.getAllParticipants)
   .post(participantController.addParticipant)
   .patch(participantController.updateParticipant)
   .delete(participantController.deleteParticipant);

export default participantRoute;
