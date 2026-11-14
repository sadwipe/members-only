export default function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You are not authenticated.');
  res.redirect('/login');
}
