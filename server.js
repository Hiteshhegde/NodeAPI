//EXPORTS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
// const errorHandler = require("./middlewares/error");

//App setup for Production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//require("dotenv").config();
//APP SETUP

const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

//MONGO CONNECTION SETUP
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection
  .once("open", () => console.log("Mongo Connection Established"))
  .on("error", (err) => {
    console.log("DB connection failed returned ", err);
  });


//ROUTER CONNECTION using Routes
const ImageDataRouter = require("./routes/imageData");
app.use("/api", ImageDataRouter);

const UserAuthRouter = require("./routes/auth");
app.use("/auth", UserAuthRouter);

const PrivateRouter = require("./routes/private");
app.use("/private", PrivateRouter);

//ERROR HANDLER IS LAST PIECE OF MIDDLEWARE
// app.use(errorHandler);

// Serve static assets if in production 
app.use(express.static(path.join(__dirname, "../dist")));



//ADDING THE LISTENER
//const port = process.env.PORT || 5000;
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
const server = app.listen(port, () => {
  console.log("HTTP listening on:" + port);
});
// process.on("unhandledRejection", (err, promise) => {
//   console.log("Logged Error", err);
//   server.close(() => process.exit(1));
// });
