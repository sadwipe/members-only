import 'dotenv/config';
import express from 'express';
import { join } from 'node:path';
import helmet from 'helmet';
import passport from 'passport';

import './config/passport.js';
import indexRouter from './routes/indexRouter.js';
import authRouter from './routes/authRouter.js';
import sessionMiddleware from './config/session.js';
import { notFoundHandler, errorHandler } from './middleware/errors.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', join(import.meta.dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.session());

app.use(authRouter);
app.use(indexRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
