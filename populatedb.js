#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

// IMPORTING MODELS
var async = require('async')
 
var DrugSchema = require('./models/Drug')
var CategorySchema = require('./models/Category')
var InstockSchema = require('./models/Instock')
var PreorderSchema = require('./models/Preorder') // 9/26 STOPPED HERE 


// CONNECTING TO MONGO DB
var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// ARRAYS FOR STORING DATA -----------------------------------------------------------------------------------------

var categories = []
var drugs = []
var instocks = []
var preorders = [] 



// FUNCTIONS FOR CREATING THE INDIVIDUAL DATA MODELS ------------------------------------------------------------------

function createCategory ( name, callback ) {
  /* These are required parameters. */
  categoryDetail = {name: name}

  var category = new CategorySchema(categoryDetail);

  category.save( function (err) {
    if (err) {
      callback(err, null);
      return;
    }
    categories.push(category);
    callback(null, category);
  });
}

function createDrug ( name, description, price, min_qty, category, preorder, in_stock, callback ) {
  drugDetail = {
    name: name,
    description: description,
    price: price,
    min_qty: min_qty
  }
  
  if (category != false) drugDetail.category = category
  if (preorder != false) drugDetail.preorder = preorder;
  if (in_stock != false) drugDetail.in_stock = in_stock;
  
  var drug = new DrugSchema(drugDetail);

  drug.save( function (err) {
    if (err) {
      callback(err, null);
      return;
    }
    console.log('New drug: ' + drug);
    drugs.push(drug);
    callback(null, drug);
  });
}

function createInstock ( in_stock, callback ) {
  instockDetail = {in_stock: in_stock}

  var instock = new InstockSchema(instockDetail);

  instock.save( function (err) {
    if (err) {
      callback(err, null);
      return;
    }
    console.log('New Instock: ' + instock);
    instocks.push(instock);
    callback(null, instock);
  })
}

function createPreorder ( preorder, callback ) {
  preorderDetail = { preorder: preorder }
  
  var preorder = new PreorderSchema(preorderDetail);

  preorder.save(function (err) {
    if (err) {
      callback(err, null);
      return;
    }
    console.log('New preorder: ' + preorder);
    preorders.push(preorder);
    callback(null, preorder);
  })
}

// FUNCTIONS TO THE SET OF DATA MODELS------------------------------------------------------------------------------------

function createDrugModels (callback) {
  async.parallel([
    function (callback) {
      createDrug(
        'Levothyroxine: 50mg | 30 pack',
        'It can treat hypothyroidism. It can also treat an enlarged thyroid gland and thyroid cancer.',
        11.99,
        100,
        categories[0],
        preorders[0],
        instocks[0],
        callback
      )
    },
    function (callback) {
      createDrug(
        'Hydrocodone Acetaminophen: 7.5-200mg | 20 pack',
        'It can treat pain.',
        29.99,
        1000,
        categories[1],
        preorders[1],
        instocks[1],
        callback
      )
    }
  ], callback);
}

function createCategoryModels (callback) {
  async.series([
    function (callback) {
      createCategory('Thyroid Hormone', callback);
    },
    (callback) => {
      createCategory('Pain Relief', callback);
    }
  ], callback);
}

function createInstockModels (callback) {
  async.series([
    function (callback) {
      createInstock(true, callback);
    }, 
    (callback) => {
      createInstock(false, callback);
    }
  ], callback);
}

function createPreorderModels (callback) {
  async.series([
    function (callback) {
      createPreorder(true, callback);
    },
    function (callback) {
      createPreorder(false, callback);
    }
  ], callback);
}

/* SCRIPT ------------------------------------------------------------------ */
async.series([
  createCategoryModels,
  createInstockModels,
  createPreorderModels,
  createDrugModels
], function (err, results) {
  if (err) {
    console.log('Final Err: ' + err);
  }

  // All done, disconnect from database
  mongoose.connection.close();
});