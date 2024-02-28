import { body } from 'express-validator';

/** validation for adding new room */
export const validationAddRoom = [
  body('id')
    .notEmpty()
    .withMessage('The id field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The id field must be string.'),
  body('room_name')
    .notEmpty()
    .withMessage('The room_name field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The room_name field must be string.'),
  body('sort_key')
    .notEmpty()
    .withMessage('The sort_key field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The sort_key field must be string.'),
  body('description')
    .notEmpty()
    .withMessage('The description field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The description field must be string.'),
  body('capacity')
    .notEmpty()
    .withMessage('The capacity field is a required field.')
    .if((value) => value !== undefined)
    .isInt()
    .withMessage('The capacity field must be number.'),
  body('room_admin_email')
    .notEmpty()
    .withMessage('The room_admin_email field is a required field.')
    .if((value) => value !== undefined)
    .isEmail()
    .withMessage('The room_admin_email field must be email.'),
  body('disabled')
    .if((value) => value !== undefined)
    .isInt()
    .withMessage('The disabled field must be number.')
];

/**validation for updating room */
export const validationUpdateRoom = [
  body('id')
    .notEmpty()
    .withMessage('The id field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The id field must be string.'),
  body('room_name')
    .notEmpty()
    .withMessage('The room_name field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The room_name field must be string.'),
  body('sort_key')
    .notEmpty()
    .withMessage('The sort_key field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The sort_key field must be string.'),
  body('description')
    .notEmpty()
    .withMessage('The description field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The description field must be string.'),
  body('capacity')
    .notEmpty()
    .withMessage('The capacity field is a required field.')
    .if((value) => value !== undefined)
    .isInt()
    .withMessage('The capacity field must be number.'),
  body('room_admin_email')
    .notEmpty()
    .withMessage('The room_admin_email field is a required field.')
    .if((value) => value !== undefined)
    .isEmail()
    .withMessage('The room_admin_email field must be email.'),
  body('disabled')
    .if((value) => value !== undefined)
    .isInt()
    .withMessage('The disabled field must be number.')
];

/** validation for deleting room */
export const validationDeleteRoom = [
  body('id')
    .notEmpty()
    .withMessage('The id field is a required field.')
    .if((value) => value !== undefined)
    .isString()
    .withMessage('The id field must be a string')
];
