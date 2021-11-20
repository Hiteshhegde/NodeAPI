const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
//
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },
  email: {
    type: String,
    required: [true, "Please provide a valid Email Id"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid Email Id",
    ],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 6,
    select: false, //TO MAKE SURE THE PASSWORD ISNT SENT WITH ALL OTHER DATA WHEN SENDING A GET REQUEST AND WE NEEDED TO SEPERATELY
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//BEFORE SAVING WE'LL HASH THE PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //THIS CHECKS IF PASSWORD WASNT CHANGED DURING SAVING THEN WE DONT RE HASH IT
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
