/**
 * Created by thanhnv on 2/17/15.
 */

var express = require('express');
var router = express.Router();
var controller = require('./controllers/index.js');

//Menus Routes
var moduleName = 'modules';

router.route('/modules').get(__acl.isAllow(moduleName, 'index'), controller.index);
router.route('/modules/reload-modules').get(__acl.isAllow(moduleName, 'active'), controller.reload, controller.index);
router.route('/modules/:route').get(__acl.isAllow(moduleName, 'active'), controller.active);
module.exports = router;
