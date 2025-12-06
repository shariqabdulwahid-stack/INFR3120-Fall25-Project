exports.requireAuth = (req, res, next) => {
  if (!req.session.user) {
    if (req.accepts('json')) {
      return res.status(401).json({ error: 'You must be logged in to perform this action.' });
    }
    return res.redirect('/login');
  }
  next();
};
