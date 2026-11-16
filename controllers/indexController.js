import 'dotenv/config';
import { matchedData, validationResult } from 'express-validator';
import {
  getAllMessages,
  updateUserMembership,
  createMessage,
} from '../db/queries.js';

// GET /
export const getIndexPage = async (req, res) => {
  const messages = await getAllMessages();

  res.render('index', { messages });
};

// GET /membership
export const getMembershipPage = (req, res) => {
  res.render('membership');
};

// POST /membership
export const addMembership = async (req, res) => {
  const user = req.user;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    return res.redirect('/membership');
  }

  if (user.membership_status) {
    req.flash('message', 'You are already part of the club.');
    return res.redirect('/membership');
  }

  const { 'membership-code': code } = matchedData(req);

  if (code !== process.env.SECRET_PASSCODE) {
    req.flash('message', 'Wrong passcode.');
    return res.redirect('/membership');
  }

  await updateUserMembership(user.id);
  req.flash('success', "You've successfully joined the club!");
  res.redirect('/');
};

// GET /create-message
export const getCreateMessageForm = (req, res) => {
  res.render('create-message');
};

// POST /create-message
export const createNewMessage = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    return res.redirect('/create-message');
  }

  const { title, message } = matchedData(req);

  const _userMessage = await createMessage(req.user.id, title, message);

  req.flash('success', "You've successfully created the message!");
  res.redirect('/');
};
