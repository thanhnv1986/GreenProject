/**
 * Created by thanhnv on 2/17/15.
 */

var express = require('express');
var router = express.Router();
var controller = require('./controllers/index.js');

//Menus Routes
var moduleName = 'menus';

router.route('/menus').get(__acl.isAllow(moduleName, 'index'), controller.index);
router.route('/menus').delete(__acl.isAllow(moduleName, 'delete'),controller.delete);
router.route('/menus/create').get(__acl.isAllow(moduleName, 'create'), controller.create);
router.route('/menus/create').post(__acl.isAllow(moduleName, 'create'), controller.save, controller.create);
router.route('/menus/update').post(__acl.isAllow(moduleName, 'update'), controller.update);
router.route('/menus/new/menuitem').get(controller.menuitem);
router.route('/menus/:cid').get(__acl.isAllow(moduleName, 'update'),controller.read);

router.param('cid', controller.menuById);
module.exports = router;
