import 'dotenv/config';

export const notFoundHandler = (req, res, next) => {
  const err = new Error(`Cannot ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).render('error', {
    status,
    message: err.message || 'Something went wrong',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
};
