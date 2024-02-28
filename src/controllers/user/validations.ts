import { body } from 'express-validator';

/** validation for adding new user */
export const validationAddUser = [
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

/**validation for updating user */
export const validationUpdateUser = [
  body('level')
    .notEmpty()
    .withMessage('The level field is a required field.')
    .if((value) => value !== undefined)
    .isInt()
    .withMessage('The level field must be number.'),
  body('name')
    .notEmpty()
    .withMessage('The name field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The name field must be number.'),
  body('display_name')
    .notEmpty()
    .withMessage('The display_name field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The display_name field must be string.'),
  body('email')
    .notEmpty()
    .withMessage('The email field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The email field must be string.')
    .isEmail()
    .withMessage('The email field must be email'),
  body('id')
    .notEmpty()
    .withMessage('The id field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The id field must be string.')
];

/** validation for changing password */
export const validationChangePwd = [
  body('id')
    .notEmpty()
    .withMessage('The id field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The id field must be a string'),
  body('password_hash')
    .notEmpty()
    .withMessage('The id field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The id field must be a string')
];

/** validation for deleting user */
export const validationDeleteUser = [
  body('id')
    .notEmpty()
    .withMessage('The id field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The id field must be a string')
];
