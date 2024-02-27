import { body } from 'express-validator';

export const addUserRules = [
  body('name')
    .isString()
    .withMessage('The name field must be string.')
    .notEmpty()
    .withMessage('The name field is a required field.')
];
