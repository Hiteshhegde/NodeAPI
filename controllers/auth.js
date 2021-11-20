const User = require("../models/auth");
const SendMail = require("../utils/EmailSender");
const crypto = require("crypto");
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const userCreator = await User.create({
      username,
      email,
      password,
    });
    sendToken(userCreator, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Please provide an email and a password",
    });
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        error: "Invalid Credentials",
      });
    }
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
exports.forgotpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User with the given mail doesnt exist",
      });
    }
    const resetToken = user.getResetToken();
    await user.save();
    const resetUrl = "http://localhost:9000/passwordreset/" + resetToken;
    const message =
      "<h1>You have requested a password Reset</h1><p>Go to the url given below to reset it</p><a href=" +
      resetUrl +
      " clicktracking=off>" +
      resetUrl +
      "</a>";
    try {
      await SendMail({
        to: user.email,
        subject: " Password Reset Request ",
        text: message,
      });
      res.status(200).json({
        success: true,
        message: "Reset Email Sent",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({
        success: false,
        message: "Email could not be sent" + error,
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.resetpassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No Token found for reset",
      });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(201).json({
      success: true,
      message: "Password has been reset",
    });
  } catch (error) {
    next(error);
  }
};
const sendToken = (user, statusCode, res) => {
  // const token = user.getSignedToken();
  return res.status(statusCode).json({
    success: true,
    token: user.getSignedToken(),
  });
};
