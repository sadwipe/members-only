import passport from 'passport';
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

  const {
    'first-name': firstName,
    'last-name': lastName,
    username,
    password,
  } = matchedData(req);

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await addUserToDatabase(
    firstName,
    lastName,
    username,
    passwordHash
  );

  req.flash(
    'success',
    `User ${user.username} successfully created! You can log in now.`
  );
  res.redirect('/login');
};

// GET /login
export const getLoginForm = (req, res) => {
  res.render('login');
};

// POST /login
export const authenticateUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info?.message || 'Invalid credentials');
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', "You've successfully logged in");
      return res.redirect('/');
    });
  })(req, res, next);
};

// POST /logout
export const logOutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
