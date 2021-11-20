fs = require("fs");
const validator = (req, res, next) => {
  if (typeof req.file === "undefined" || typeof req.body === "undefined") {
    res.status(400).send({
      error: "Problem in sending data",
    });
  } else {
    console.log(req.file);
    let image = req.file.path;
    if (
      !req.file.mimetype.includes("jpeg") &&
      !req.file.mimetype.includes("png") &&
      !req.file.mimetype.includes("jpg") &&
      !req.file.mimetype.includes("mpeg") &&
      !req.file.mimetype.includes("mpg") &&
      !req.file.mimetype.includes("mp4") &&
      !req.file.mimetype.includes("wav")
    ) {
      fs.unlinkSync(image);
      return res.status(400).json({
        error: "file not supported",
      });
    }
    //MAX FILE SIZE IS 200MB
    if (req.file.size > 1024 * 1024 * 200) {
      fs.unlinkSync(image);
      return res.status(400).json({
        error: "file's too large",
      });
    }
  }
  next();
};
module.exports = validator;
