const express = require('express');
const entryController = require('../controllers/entryController');

const entryRoute = express.Router();

entryRoute
   .route('')
   .get(entryController.getAllEntries)
   .post(entryController.addEntry)
   .patch(entryController.updateEntry)
   .delete(entryController.deleteEntry);

module.exports = entryRoute;
