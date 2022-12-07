require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var hbs = require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');
var compression = require('compression');
var helmet = require('helmet');

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const UserSchema = require('./models/User');
const bcrypt = require('bcryptjs');

var app = express();

app.use(helmet());

//Set up mongoose connection
var mongoose = require('mongoose');

var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(compression()); //Compress all routes


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartial('partials', path.join(__dirname, 'views/partials/'));

passport.use(
  new LocalStrategy((username, password, done) => {
    UserSchema.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      
      bcrypt.compare(password, user.password, (err, res) => {

        if (res) {
          // passwords match! log user in
          app.locals.currentUser = user;
          
          return done(null, user)

        } else if (!res) {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      });
      
      return;
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserSchema.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session({ secret: process.env.SESSION_SECRET, cookie: { maxAge: 1 }}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('CATCHING 404');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
