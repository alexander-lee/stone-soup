import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import compression from 'compression';
import RateLimit from 'express-rate-limit';
import config from './config/config';

const app = express();
const MongoStore = require('connect-mongo')(session);
const credentials = config[process.env.NODE_ENV || 'development'];

//============ VIEW ===========
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

//============ EXPRESS ============
// app.use(favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); // parse json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.use(compression());

// Mongoose Connection
mongoose.connect(credentials.host);

// Create Session
app.use(session({
  secret: 'super secret token',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600 * 1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

// Passport
require('./utils/passport-setup');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rate Limiter
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  delayMs: 0
});
app.use('/api', limiter);

//========== ROUTES ==========
app.use('/', require('./routes/index'));
app.use('/', require('./routes/user'));
app.use('/api/restaurant', require('./routes/restaurant'));
app.use('/api/client', require('./routes/client'));

app.use('*', require('./routes/index'));

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
export default app;
