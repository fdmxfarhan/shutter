const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var multer = require('multer');
const bcrypt = require('bcrypt');

// Routs partials
const index = require('./routes/index');
const user = require('./routes/user');
const dashboard = require('./routes/dashboard');
const blog = require('./routes/blog');
const order = require('./routes/order');
var uploadHandler = require('./routes/upload');
var payment = require('./routes/payment');

const { has } = require('express-mongo-sanitize');
// Start Express App
const app = express();

require('./config/passport')(passport);


// 1) Middlewares
// Serving Static Files
// app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowsMS: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

// express session middleware
const{
  SESS_NAME = 'sid',
  SESS_TIME = 1000 * 60 * 60 * 2 
} = process.env

app.use(session({
  name: SESS_NAME,
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: SESS_TIME ,
    sameSite: false,
    secure: false
  }
}));
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

//Global vars
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization againts XSS
app.use(xss());

// Prevent paramater pollution
// TODO: add the whiteList later
// app.use(hpp({
//   whitelist: []
// }));

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// upload 
app.use('/upload', uploadHandler);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 3) Routes
app.use('/', index);
app.use('/user', user);
app.use('/dashboard', dashboard);
app.use('/blog', blog);
app.use('/order', order);
app.use('/payment', payment);


/* Serving React TODO: DEbug */
console.log(process.env.NODE_ENV);

// 4) React App

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'client/build')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//   });
// }

// app.get('/', (req, res) => {
//   res.send('Hello');
// });

// app.get('/api/hello', (req, res) => {
//   res.send('Hello');
// });

module.exports = app;
