/**
 * Created by thanhnv on 2/17/15.
 */

var express = require('express');
var router = express.Router();
var controller = require('./controllers/index.js');

//Menus Routes
var moduleName = 'pages';

router.route('/pages').get(__acl.isAllow(moduleName, 'index'), controller.index);
module.exports = router;
