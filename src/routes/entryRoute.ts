import express from 'express';
import entryController from '../controllers/entry/entryController';

const entryRoute = express.Router();

entryRoute.route('/getByConditions').post(entryController.getEntryByConditions);

entryRoute.route('/deleteAll').delete(entryController.deleteAllEntries);

entryRoute
  .route('/')
  .get(entryController.getAllEntries)
  .post(entryController.addEntry)
  .patch(entryController.updateEntry)
  .delete(entryController.deleteEntry);

export default entryRoute;
