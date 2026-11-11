import express from 'express';

import * as authController from '../controllers/authController.js';
import { validateNewUser } from '../middleware/validator.js';

const authRouter = express.Router();

authRouter.get('/register', authController.getRegisterForm);
authRouter.post('/register', validateNewUser, authController.createUser);

authRouter.get('/login', authController.getLoginForm);
authRouter.post('/login', authController.authenticateUser);

authRouter.post('/logout', authController.logOutUser);

export default authRouter;
