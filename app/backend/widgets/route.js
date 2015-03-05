/**
 * Created by thanhnv on 2/17/15.
 */

var express = require('express');
var router = express.Router();
var controller = require('./controllers/index.js');

//Menus Routes
var moduleName = 'widgets';

router.route('/widgets').get(__acl.isAllow(moduleName, 'index'), controller.index);
router.route('/widgets/sidebars').get(__acl.isAllow(moduleName, 'index'), controller.sidebar);

router.route('/widgets/sidebars/add/:widget').get(__acl.isAllow(moduleName, 'index'), controller.addWidget);
router.route('/widgets/sidebars/save').post(__acl.isAllow(moduleName, 'index'), controller.saveWidget);
router.route('/widgets/sidebars/:cid').get(__acl.isAllow(moduleName, 'index'), controller.read);
module.exports = router;
