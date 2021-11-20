const express = require("express");
const router = express.Router();
//

const { getPrivateData } = require("../controllers/private");
const { protect } = require("../middlewares/protected");
router.get("/", protect, getPrivateData);
module.exports = router;
