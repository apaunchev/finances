exports.login = (req, res) => {
  res.render('login');
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};
