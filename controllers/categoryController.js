var CategorySchema = require('../models/Category');
var DrugSchema = require('../models/Drug');

var async = require('async');

const {body, validationResult} = require('express-validator');


// /categories
exports.categoryList = function (req, res) {
  CategorySchema.find({}, 'name')
  .exec( function (err, categoryList) {
    if (err) {return next(err);}
    res.render('categoryList', {data: categoryList, err: err, user: req.user});
  });
};

// /categories/create **get req**
exports.categoryCreateGet = function (req, res) {
  res.render('categoryCreate', { user: req.user })
};

// 	/categories/create **post req**
exports.categoryCreatePost = [

  // Validate and sanitize field.
  body('categoryInputName', 'Empty Category Input Name').trim().isLength({min: 1}).escape(),

  // Process request
  (req, res, next) => {
    const errors = validationResult(req);

    // Create new category
    var category = new CategorySchema({
      name: req.body.categoryInputName
    });

    if (!errors.isEmpty()) {
      res.render('categoryCreate', { category: category, errors: errors.array() });
      return;

    } else {
      CategorySchema.findOne({ 'name': req.body.name })
      .exec( function (err, found_category) {
        if (err) { return next(err); }

        if (found_category) { res.redirect(found_category.url); }

        else {
          category.save( function (err) {
            if (err) { return next(err); }

            res.redirect('/catalog/category');
          })
        }
      });
    }
  }
];

// 	/categories/delete **get req**
exports.categoryDeleteGet = function (req, res) {
  CategorySchema.find({}, 'name')
  .sort([['name', 'ascending']])
  .exec( function (err, categories_list) {
    if (err) {return next (err);}

    res.render('categoryDelete', { categoryDropdown: categories_list });    
  })
};

// /categories/delete **post req**
exports.categoryDeletePost = function (req, res, next) {

  async.parallel({
    category: function (callback) {
      CategorySchema.find({ '_id': req.body.categoryDropdown}, '_id')
      .exec(callback);
    },
    category_drugs: function (callback) {
      DrugSchema.find({ 'category': req.body.categoryDropdown}, 'name')
      .exec(callback);
    },
  }, function (err, results) {
    if (err) {return next(err);}
    if (results.category_drugs.length > 0) {
      res.render('categoryDelete', {category_drugs: results.category_drugs});
      return;
    } else {
      CategorySchema.findByIdAndRemove(req.body.categoryDropdown, function (err) {
        if (err) {return next(err);}
        res.redirect('/catalog/category');
      })
    }
  })
};

// /categories/update **get req**
exports.categoryUpdateGet = function (req, res) {
  res.send('Not implemented: categoryUpdateGet');
};

// /categories/update **post req**
exports.categoryUpdatePost = function (req, res) {
  res.send('Not implemented: categoryUpdatePost');
};

// /categories/<category id>
exports.categoryDetail = function (req, res) {
  res.send('Not implemented: categoryDetail');
};