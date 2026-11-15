import 'dotenv/config';
import { matchedData, validationResult } from 'express-validator';
import { getAllMessages, updateUserMembership } from '../db/queries.js';

export const getIndexPage = async (req, res) => {
  const messages = await getAllMessages();

  console.log(messages);

  res.render('index', { messages });
};

export const getMembershipPage = (req, res) => {
  res.render('membership');
};

export const addMembership = async (req, res) => {
  const user = req.user;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render('membership', { errors: errors.array() });
  }

  if (user.membership_status) {
    return res.render('membership', {
      message: 'You are already part of the club.',
    });
  }

  const { 'membership-code': code } = matchedData(req);

  if (code !== process.env.SECRET_PASSCODE) {
    return res.status(400).render('membership', { message: 'Wrong passcode.' });
  }

  await updateUserMembership(user.id);
  req.flash('success', "You've successfully joined the club!");
  res.redirect('/');
};

export const getCreateMessageForm = (req, res) => {
  res.render('create-message');
};

export const createNewMessage = (_req, _res) => {};
