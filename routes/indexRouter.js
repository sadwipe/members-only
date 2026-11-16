import express from 'express';

import isAuthenticated from '../middleware/isAuthenticated.js';
import {
  getIndexPage,
  getMembershipPage,
  addMembership,
  getCreateMessageForm,
  createNewMessage,
} from '../controllers/indexController.js';

import {
  validateMembership,
  validateMessage,
} from '../middleware/validator.js';

const indexRouter = express.Router();

indexRouter.get('/', isAuthenticated, getIndexPage);

indexRouter.get('/membership', isAuthenticated, getMembershipPage);
indexRouter.post(
  '/membership',
  isAuthenticated,
  validateMembership,
  addMembership
);

indexRouter.get('/create-message', isAuthenticated, getCreateMessageForm);
indexRouter.post(
  '/create-message',
  isAuthenticated,
  validateMessage,
  createNewMessage
);

export default indexRouter;
