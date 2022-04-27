var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var axios = require('axios').default;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

const geoKey = "cd6d9b2cc9a94dcbbbc891c56d26e49c";

app.get('/api/location', async function (req, res) {
  let ip = req.ip; // useless for testing

  ip = "2607:f2c0:e4b2:d8:7442:ca8d:98aa:df23"; // used for testing

  let ipUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${geoKey}&ip=${ip}`;

  let response = await axios.get(ipUrl);

  let data = response.data;

  res.json({ lat: data.latitude, lng: data.longitude, ip: ip });

});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;