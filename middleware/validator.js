import { body } from 'express-validator';

import { findUserByUsername } from '../db/queries.js';

function nameValidator(fieldname, label, { min = 2, max = 50 }) {
  return body(fieldname)
    .trim()
    .notEmpty()
    .withMessage(`${label} cannot be empty.`)
    .isAlpha('en-US', { ignore: " -'" })
    .withMessage(`${label} must consist only of letters.`)
    .isLength({ min, max })
    .withMessage(
      `${label} length must be between ${min} and ${max} characters.`
    );
}

export const validateNewUser = [
  nameValidator('first-name', 'First Name', { min: 3, max: 30 }),
  nameValidator('last-name', 'Last Name', { min: 3, max: 30 }),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username cannot be empty.')
    .isAlphanumeric('en-US')
    .withMessage('Username must consist only of letters and numbers.')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username length must be between 3 and 30 characters.')
    .custom(async (username) => {
      const foundUser = await findUserByUsername(username);
      if (foundUser) {
        throw new Error('Username already exists.');
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  body('confirm-password')
    .trim()
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];

export const validateMembership = body('membership-code')
  .trim()
  .notEmpty()
  .withMessage('Message required')
  .isLength({ min: 3, max: 20 })
  .withMessage('The membership code has between 3 and 20 characters.');
