'use strict'
/**
 * Created by thanhnv on 2/17/15.
 */

let express = require('express');
let router = express.Router();
let controller = require('./controllers/index.js');

//Menus Routes
let moduleName = 'widgets';

router.route('/widgets').get(__acl.isAllow(moduleName, 'index'), controller.index);
router.route('/widgets/sidebars').get(__acl.isAllow(moduleName, 'index'), controller.sidebar);
router.route('/widgets/sidebars/sort').post(__acl.isAllow(moduleName, 'index'), controller.sidebar_sort);

router.route('/widgets/sidebars/add/:widget').get(__acl.isAllow(moduleName, 'index'), controller.addWidget);
router.route('/widgets/sidebars/save').post(__acl.isAllow(moduleName, 'index'), controller.saveWidget);
router.route('/widgets/sidebars/:cid').get(__acl.isAllow(moduleName, 'index'), controller.read);
router.route('/widgets/sidebars/:cid').delete(__acl.isAllow(moduleName, 'index'), controller.delete);
module.exports = router;
