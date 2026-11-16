import 'dotenv/config';
import { matchedData, validationResult } from 'express-validator';
import {
  getAllMessages,
  updateUserMembership,
  createMessage,
  updateUserAdminStatus,
  findUserMessageByTitle,
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

  const existingTitle = await findUserMessageByTitle(req.user.id, title);

  if (existingTitle) {
    req.flash('errors', [
      { msg: 'You cannot post messages with the same title.' },
    ]);
    return res.redirect('/create-message');
  }

  const _userMessage = await createMessage(req.user.id, title, message);

  req.flash('success', "You've successfully created the message!");
  res.redirect('/');
};

// GET /admin-riddle
export const getAdminAccessPage = (req, res) => {
  if (req.user.is_admin) {
    req.flash('success', 'You are already an administrator!');
    return res.redirect('/');
  }
  res.render('admin-riddle');
};

export const postAdminRiddle = async (req, res) => {
  const userAnswer = req.body.answer?.trim().toLowerCase();
  if (userAnswer === process.env.ADMIN_PASSWORD) {
    await updateUserAdminStatus(req.user.id, true);
    req.flash('success', 'Correct! Administrative privileges granted.');
    return res.redirect('/');
  } else {
    req.flash('errors', ['Incorrect password. The gate remains locked.']);
    return res.redirect('/admin-riddle');
  }
};
