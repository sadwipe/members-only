import express from 'express';

import isAuthenticated from '../middleware/isAuthenticated.js';
import {
  getIndexPage,
  getMembershipPage,
  addMembership,
  getCreateMessageForm,
  createNewMessage,
  getAdminAccessPage,
  postAdminRiddle,
} from '../controllers/indexController.js';

import {
  validateMembership,
  validateMessage,
} from '../middleware/validator.js';

const indexRouter = express.Router();

indexRouter.get('/', getIndexPage);

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

indexRouter.get('/admin-riddle', isAuthenticated, getAdminAccessPage);
indexRouter.post('/admin-riddle', isAuthenticated, postAdminRiddle);

export default indexRouter;
