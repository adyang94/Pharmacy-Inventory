require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');
var compression = require('compression');
var helmet = require('helmet');

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
const session = require("express-session");
const UserSchema = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var app = express();

app.use(helmet());

//Set up mongoose connection
var mongoose = require('mongoose');

var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
console.log('\n 2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, '+++++++++++++++++++++MongoDB connection error:'));

app.use(compression()); //Compress all routes


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartial('partials', path.join(__dirname, 'views/partials/'));

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log('LOCAL STRATEGY: Username Password: ', username, password);
    UserSchema.findOne({ username: username }, (err, user) => {
      if (err) { 
        console.log('1/1');
        return done(err);
      }
      if (!user) {
        console.log('1/2 ');
        return done(null, false, { message: "Incorrect username" });
      }
      
      bcrypt.compare(password, user.password, (err, res) => {
        console.log('\ncompareSync and res:', res);

        if (res) {
          console.log('1/3', res);
          // passwords match! log user in
          app.locals.currentUser = user;
          
          console.log('USER: ', user);
          console.log('bcrypt logged in\n');

          // issueToken(req.user, function(err, token) {
          //   if (err) { return next(err); }
          //   res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 1000 });
          //   return next();
          // });

          return done(null, user)

        } else if (!res) {
          // passwords do not match!
          console.log('1/4');
          return done(null, false, { message: "Incorrect password" })
        }
      });
      console.log('1/5');
      
      return;
    });
  })
);

function issueToken(user, done) {
  var token = utils.generateToken(64);
  Token.save(token, { userId: user.id }, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}

// passport.use(new RememberMeStrategy(
//   function(token, done) {

//     //Is Token supposed to be capitalized???
//     Token.consume(token, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       return done(null, user);
//     });
//   },
//   issueToken
// ));

passport.serializeUser(function(user, done) {
  console.log('SERIALIZE');
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserSchema.findById(id, function(err, user) {
    console.log('DESERIALIZE');
    done(err, user);
  });
});

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session({ secret: 'secret', cookie: { maxAge: 1 }}));
// app.use(passport.authenticate('remember-me'));




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

/* This middleware below makes the user a global variable. This middleware must be placed between after authentication and before view rendering! Check index.hbs for how it's referenced */
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  console.log('RES.LOCALS CREATION: ', res.locals);
  
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

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];

  // Check if bearer is udnefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    console.log('REQ.TOKEN: ', req.token);
    // Next middleware
    next();

  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

console.log('\n 5.');

module.exports = app;
