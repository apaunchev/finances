const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");

exports.login = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Incorrect email or password.",
  successRedirect: "/"
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash("error", "Please login to continue.");
  res.redirect("/login");
};

exports.forgotForm = (req, res) => {
  res.render("forgot", { title: "Forgotten password" });
};

exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("error", "No account with that email exists.");
    return res.redirect("/login");
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour from now
  await user.save();
  res.redirect(`/account/reset/${user.resetPasswordToken}`);
};

exports.reset = async (req, res) => {
  const user = User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpiresAt: { $gt: Date.now() }
  });
  if (!user) {
    req.flash("error", "Password reset token is invalid or has expired.");
    return res.redirect("/login");
  }
  res.render("reset", { title: "Reset your password" });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    return next();
  }
  req.flash("error", "Passwords do not match.");
  res.redirect("back");
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpiresAt: { $gt: Date.now() }
  });
  if (!user) {
    req.flash("error", "Password reset token is invalid or has expired.");
    return res.redirect("/login");
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash("success", "Your password has been reset. You are now logged in.");
  res.redirect("/");
};
