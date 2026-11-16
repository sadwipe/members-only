export default function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

export function isAdmin(req, res, next) {
  if (req.user.is_admin) {
    return next();
  }

  req.flash('errors', "You don't have admin privileges.");
  res.redirect('/');
}
