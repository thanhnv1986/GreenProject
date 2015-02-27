/**
 * Created by thanhnv on 2/17/15.
 */

var express = require('express');
var router = express.Router();
var controller = require('./controllers/index.js');

//configuration Routes
var moduleName = 'configurations';

router.route('/configurations/site-info').get(__acl.isAllow(moduleName, 'update_info'), controller.index);
router.route('/configurations/themes').get(__acl.isAllow(moduleName, 'change_theme'), controller.index);
router.route('/configurations/themes/import').get(__acl.isAllow(moduleName, 'import_theme'), controller.index);
router.route('/configurations/themes').delete(__acl.isAllow(moduleName, 'delete_theme'), controller.index);

module.exports = router;
