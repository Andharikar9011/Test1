require("dotenv").config();
// import Libraries
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const path = require("path");
var logger = require("morgan");

// import routes
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
/* const userRouter = require("./routes/user");
const adminRouter = require("./routes/auth"); */

//app
var app = express();

// db connection
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false,
  })
  .then(() => {
    console.log("Connected to Db in azure .... ");
  })
  .catch((err) => {
    console.log(`Error occurred : ${err}`);
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
//middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});
// Routers
app.use("/", indexRouter);
/* app.use('/api',authRouter);
app.use('/api',userRouter); */
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
