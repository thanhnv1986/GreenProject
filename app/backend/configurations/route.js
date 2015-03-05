/**
 * Created by thanhnv on 2/17/15.
 */

var express = require('express');
var router = express.Router();
var index = require('./controllers/index.js');
var themes = require('./controllers/themes.js');

//configuration Routes
var moduleName = 'configurations';

router.route('/configurations/site-info').get(__acl.isAllow(moduleName, 'update_info'), index.index);
router.route('/configurations/themes').get(__acl.isAllow(moduleName, 'change_themes'), themes.index);
router.route('/configurations/themes/:themeName').post(__acl.isAllow(moduleName, 'change_themes'), themes.change_themes);
router.route('/configurations/themes/import').get(__acl.isAllow(moduleName, 'import_themes'), themes.import);
router.route('/configurations/themes').delete(__acl.isAllow(moduleName, 'delete_themes'), themes.delete);

module.exports = router;
