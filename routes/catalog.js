var express = require('express');
var router = express.Router();

// Add controller modules
var drugController = require('../controllers/drugController');
var categoryController = require('../controllers/categoryController');
var homepageController = require('../controllers/homepageController');

/// HOMEPAGE ///
router.get('/', homepageController.homepage);

/* GET req for sign up form */
router.get('/signup', homepageController.signupGet)

/* POST req for sign up form */
router.post('/signup', homepageController.signupPost);

/* GET req for log in form */
router.get('/login', homepageController.loginGet);

/* POST req for log in form */
router.post('/login', homepageController.loginPost);

/* GET req for log out */
router.get('/logout', homepageController.logout);

/// DRUG ROUTES ///
/* GET req for drug list */
router.get('/drug', drugController.drugList);

/* GET req for creating a drug */
router.get('/drug/create', drugController.drugCreateGet);

/* POST req for creating a drug */
router.post('/drug/create', drugController.drugCreatePost);

/* GET req for deleting a drug */
router.get('/drug/delete', drugController.drugDeleteGet);

/* POST req for deleting a drug */
router.post('/drug/delete', drugController.drugDeletePost);

/* GET req for updating a drug */
router.get('/drug/update', drugController.drugUpdateGet);

/* POST req for updating a drug */
router.post('/drug/update', drugController.drugUpdatePost);

/* GET req for 1 drug detail */
router.get('/drug/:id', drugController.drugDetail);


/// CATEGORY ROUTES ///
/* GET req for category list */
router.get('/category', categoryController.categoryList);

/* GET req for creating a category */
router.get('/category/create', categoryController.categoryCreateGet);

/* POST req for creating a category */
router.post('/category/create', categoryController.categoryCreatePost);

/* GET req for deleting a category */
router.get('/category/delete', categoryController.categoryDeleteGet);

/* POST req for deleting a category */
router.post('/category/delete', categoryController.categoryDeletePost);

/* GET req for updating a category */
router.get('/category/update', categoryController.categoryUpdateGet);

/* POST req for updating a category */
router.post('/category/update', categoryController.categoryUpdatePost);



module.exports = router;