const express = require("express");
const router = express.Router();
const {
  register,
  forgotpassword,
  resetpassword,
  login,
} = require("../controllers/auth");

//
router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotpassword);
router.post("/resetpassword/:resetToken", resetpassword);
module.exports = router;