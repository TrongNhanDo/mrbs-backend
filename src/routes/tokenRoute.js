const express = require('express');
const tokenController = require('../controllers/tokenController');
const tokenRoute = express.Router();

tokenRoute
  .route('/')
  .get(tokenController.getAllTokens)
  .post(tokenController.addToken);

module.exports = tokenRoute;
