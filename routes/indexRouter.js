import express from 'express';

import isAuthenticated, {
  isAdmin,
} from '../middleware/authenticationMiddleware.js';
import {
  getIndexPage,
  getMembershipPage,
  addMembership,
  getCreateMessageForm,
  createNewMessage,
  getAdminAccessPage,
  postAdminRiddle,
  removeMessage,
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

indexRouter.post(
  '/messages/:messageId/delete',
  isAuthenticated,
  isAdmin,
  removeMessage
);

indexRouter.get('/admin-riddle', isAuthenticated, getAdminAccessPage);
indexRouter.post('/admin-riddle', isAuthenticated, postAdminRiddle);

export default indexRouter;
