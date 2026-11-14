import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';

const indexRouter = express.Router();

indexRouter.get('/', isAuthenticated, (req, res) => {
  res.render('index');
});

export default indexRouter;
