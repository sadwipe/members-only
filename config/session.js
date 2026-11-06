import 'dotenv/config';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import pool from '../db/pool.js';

const PgSession = connectPgSimple(session);

export default session({
  store: new PgSession({
    pool,
    createTableIfMissing: true,
  }),
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
});
