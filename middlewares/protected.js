//TO MAKE PROTECTED URLS WHERE ONLY LOGGED IN USERS CAN VIEW THEIR SECRETS
const jwt = require("jsonwebtoken");
//const User = require("../models/auth");
const User = require("../models/auth");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //Bearer dnvdjnvodkj<--token
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route {tokenless}",
    });
  }
  try {
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded_token.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user was found",
      });
    }
    req.user = user;
    res.status(200).json(req.user);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,

      message: "Not authorized to access this route: ",
      error,
    });
  }
};
