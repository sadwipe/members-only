import { validationResult, matchedData } from 'express-validator';
import bcrypt from 'bcrypt';

import { createUser as addUserToDatabase } from '../db/queries.js';

// GET /register
export const getRegisterForm = (req, res) => {
  res.render('register');
};

// POST /register
export const createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render('register', { errors: errors.array() });
  }

  const { firstName, lastName, username, password } = matchedData(req);

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await addUserToDatabase(
    firstName,
    lastName,
    username,
    passwordHash
  );

  console.log(user);

  res.redirect('/login');
};

// GET /login
export const getLoginForm = (req, res) => {
  res.render('login');
};

// POST /login
export const authenticateUser = (_req, _res) => {};

// POST /logout
export const logOutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
