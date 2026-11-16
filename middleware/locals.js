const setCurrentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.errors = req.flash('errors');
  res.locals.message = req.flash('message');
  next();
};

export default setCurrentUser;
