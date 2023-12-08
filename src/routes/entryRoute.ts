import express from 'express';
import entryController from '../controllers/entry/entryController';

const entryRoute = express.Router();

entryRoute
   .route('/')
   .get(entryController.getAllEntries)
   .post(entryController.addEntry)
   .patch(entryController.updateEntry)
   .delete(entryController.deleteEntry);

entryRoute.route('/getByConditions').post(entryController.getEntryByConditions);

export default entryRoute;
