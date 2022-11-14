var DrugSchema = require('../models/Drug');
var CategorySchema = require('../models/Category');
var InstockSchema = require('../models/Instock');
var PreorderSchema = require('../models/Preorder');

var async = require('async');
const {body, validationResult} = require('express-validator');

// /drugs
exports.drugList = function (req, res, next) {
  DrugSchema.find({}, )
  .populate('category')
  .populate('in_stock')
  .populate('preorder')
  .exec( function (err, drugList) {
    if (err) {return next(err);}
    console.log('Drug List: ', drugList);
    console.log('\nUSER NAME: ', res.locals.currentUser);
    console.log('\nREQ.USER+++++++++++++:', req.user);
    res.render('drugList.hbs', {data: drugList, user: req.user, err: err});
  })
};

// /drugs/create **get req**
exports.drugCreateGet = function (req, res, next) {
  async.parallel({
    Categories: function (callback) {
      CategorySchema.find().exec(callback);
    },
    Instock: function (callback) {
      InstockSchema.find().exec(callback);
    },
    Preorder: function (callback) {
      PreorderSchema.find().exec(callback)
    }
  }, function (err, results) {
    console.log('\nRESULTS: ', results);
    res.render('drugCreate', {Categories: results.Categories, Instock: results.Instock, Preorder: results.Preorder, user: req.user});
  })
};

// /drugs/create **post req**
exports.drugCreatePost = [
  // Validate and sanitze field
  body('drugInputName', 'Empty Drug Input Name').trim().isLength({min: 1}).escape(),
  body('drugDescriptionInputName', 'Empty Description Input').trim().isLength({min: 1}).escape(),
  body('drugCategory', 'Empty Category Input').trim().isLength({min: 1}).escape(),
  body('drugPrice', 'Empty Price Input').trim().isLength({min: 1}).escape(),
  body('drugInstock', 'Empty In Stock Input').trim().isLength({min: 1}).escape(),
  body('drugPreorder', 'Empty Pre-Order Input').trim().isLength({min: 1}).escape(),
  body('drugMinQty', 'Empty Min Qty Input').trim().isLength({min: 1}).escape(),
  
  // Process request
  (req, res, next) => {
    console.log('3');
    const errors = validationResult(req);
    console.log('1');
    // Create new category
    var drug = new DrugSchema({
      name: req.body.drugInputName,
      description: req.body.drugDescriptionInputName,
      price: req.body.drugPrice,
      category: req.body.drugCategory,
      preorder: req.body.drugPreorder,
      in_stock: req.body.drugInstock,
      min_qty: req.body.drugMinQty,
    });
    console.log('2');
    if (!errors.isEmpty()) {
      console.log('4');
      res.render('drugCreate', { drug: drug, errors: errors.array() });
      return;

    } else {
      console.log('5');
      DrugSchema.findOne({ 'name': req.body.name })
      .exec( function (err, found_drug) {
        if (err) { return next(err); }
        console.log('7');
        console.log(err);
        if (found_drug) { res.redirect(found_drug.url); }

        else {
          console.log('8');
          drug.save( function (err) {
            console.log(err);
            if (err) { return next(err); }
            console.log('6');
            console.log('\nSAVE SUCCESS', drug);

            res.redirect('/catalog/drug');
          })
        }
      });
    }
  }


]

// /drugs/delete **get req**
exports.drugDeleteGet = function (req, res) {
  DrugSchema.find({})
  .sort()
  .exec( function (err, drugs_list) {
    if (err) {return next (err);}
    console.log('drugs list: ', drugs_list);
    
    res.render('drugDelete', {drugDropdown: drugs_list});
  })
};

// /drugs/delete **post req**
exports.drugDeletePost = function (req, res, next) {
  async.parallel({
    drug: function (callback) {
      DrugSchema.find({'_id': req.body.drugDropdown}, '_id')
      .exec(callback);
    }
  }, function (err, results) {
    if (err) {return next(err);}

    if (results.drug.length > 0) {
      DrugSchema.findByIdAndRemove(req.body.drugDropdown, function (err) {
        if (err) {return next(err);}
        res.redirect('/catalog/drug');
      })
    }
  })
};

// /drugs/update **get req**
exports.drugUpdateGet = function (req, res) {
  res.send('Not implemented: drugUpdateGet');
};

// /drugs/update **post req**
exports.drugUpdatePost = function (req, res) {
  res.send('Not implemented: drugUpdatePost');
};

// /drugs/<drug id> 
exports.drugDetail = function (req, res) {
  res.send('Not implemented: drugDetail');
};