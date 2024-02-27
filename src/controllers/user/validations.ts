import { body } from 'express-validator';

export const addUserRules = [
  body('name')
    .notEmpty()
    .withMessage('The name field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The name field must be string.'),
  body('level')
    .notEmpty()
    .withMessage('The level field is a required field.')
    .if((value) => value !== undefined)
    .isInt()
    .withMessage('The level field must be number.'),
  body('display_name')
    .notEmpty()
    .withMessage('The display_name field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The display_name field must be string.'),
  body('password_hash')
    .notEmpty()
    .withMessage('The password_hash field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The password_hash field must be string.'),
  body('email')
    .notEmpty()
    .withMessage('The email field is a required field.')
    .if((value) => value !== undefined)
    .isEmail()
    .withMessage('The email field must be string.'),
  body('last_login')
    .notEmpty()
    .withMessage('The last_login field is a required field.')
    .if((value) => value !== undefined)
    .isInt()
    .withMessage('The last_login field must be string.')
];
