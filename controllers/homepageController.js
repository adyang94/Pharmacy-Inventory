var DrugSchema = require('../models/Drug');
var CategorySchema = require('../models/Category');
var InstockSchema = require('../models/Instock');
var PreorderSchema = require('../models/Preorder');
var UserSchema = require('../models/User');

var async = require('async');
const passport = require("passport");
const bcrypt = require('bcryptjs');



// GET HOMEPAGE
exports.homepage = function (req, res) {
  console.log('Going to Homepage');
  async.parallel({
    drugCount: function(callback) {
      DrugSchema.countDocuments({}, callback);
    },
    categoryCount: function (callback) {
      CategorySchema.countDocuments({}, callback);
    },
    outOfStockCount: function (callback) {
      InstockSchema.countDocuments({in_stock: false}, callback);
    },
    preorderCount: function (callback) {
      PreorderSchema.countDocuments({preorder: true}, callback);
    }
  }, function (err, results) {
    console.log('\nRESULTS: ', results, '\nERROR: ', err);
    console.log('\nUSER: ', req.user);
    res.render('index', {error: err, data: results, user: req.user});
  });
};

/* GET SIGN UP FORM */
exports.signupGet = function (req, res) {
  res.render('signupForm');
};

/* POST SIGN UP FORM */
exports.signupPost = function (req, res) {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    // if err, do something
    if (err) {
      console.log('HASH ERROR');
      return;

    } else {
      const user = new UserSchema({
        username: req.body.username,
        password: hashedPassword
      }).save(err => {
        if (err) { 
          return next(err);
        }
        res.redirect('/catalog');
      });
    }
  });
};

/* GET LOG IN FORM */
exports.loginGet = function (req, res) {
  res.render('loginForm');
};

/* POST LOG IN FORM */
exports.loginPost = function (req, res, next) {
  
  console.log('LOGIN POST\n', req.body);

  passport.authenticate("local", {
    successRedirect: "/catalog",
    failureRedirect: "/catalog/signup"
  })(req, res, next);
  
  console.log('LOGIN POST+');
  
  // (req, res, next) => {
  //   // issue a remember me cookie if the option was checked
  //   console.log('LOGIN POST1');
  //   if (!req.body.remember_me) { return next(); }
  //   console.log('LOGIN POST11');

  //   var token = utils.generateToken(64);
  //   Token.save(token, { userId: req.user.id }, function(err) {
  //     if (err) { return done(err); }
  //     res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
  //     return;
  //   });
  // }

  console.log('LOGIN POST1');
  // res.redirect('/catalog');
  return;
}


/* GET LOGOUT FLOW */
exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
}