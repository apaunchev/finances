const mongoose = require('mongoose');
const User = mongoose.model('User');
const Category = mongoose.model('Category');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('back');
  }
  res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('back');
  }
  res.render('register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must provide a name.').notEmpty();
  req.checkBody('email', 'You must provide an email address.').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be blank.').notEmpty();
  req.checkBody('password-confirm', 'Confirmed password cannot be blank.').notEmpty();
  req.checkBody('password-confirm', 'Your passwords did not match.').equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  const category = await (new Category({ name: 'Unsorted', icon: 'tag', user: user._id })).save();
  next();
};

exports.account = async (req, res) => {
  res.render('account', { title: 'Edit your account' });
};

exports.settings = (req, res) => {
  res.render('settings', { title: 'Settings' });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Your profile was updated successfully.');
  res.redirect('back');
};

exports.budget = (req, res) => {
  res.render('budget', { title: 'Budget' });
};

exports.updateBudget = async (req, res) => {
  const updates = {
    monthlyBudget: req.body.monthlyBudget
  };
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates }
  );
  res.redirect('/settings');
};
