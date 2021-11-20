multer = require("multer");
// import "../client/totext/public/uploads/"
path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./client/totext/public/uploads/");
  },

  filename: (req, file, callback) => {
    callback(
      null,

      "resource" + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
module.exports = upload.single("image");
