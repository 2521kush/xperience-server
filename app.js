var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var registerRouter = require("./routes/register");

var seniorRouter = require("./routes/user/senior");
var juniorRouter = require("./routes/user/junior");

var connect = require("./config/dbconfig");

var app = express();
const port = process.env.PORT || 8000;
connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/register", registerRouter);
app.use("/api/senior", seniorRouter);
app.use("/api/junior", juniorRouter);

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

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
