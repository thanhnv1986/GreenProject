/**
 * Created by thanhnv on 2/17/15.
 */

var express = require('express');
var router = express.Router();
var controller = require('./controllers/index.js');

//Books Routes

router.route('/menus').get(controller.index);

router.route('/menus/create').get(controller.create);
router.route('/menus/create').post(controller.save, controller.create);
router.route('/menus/update').post(controller.update);
router.route('/menus/new/menuitem').get(controller.menuitem);
router.route('/menus/:cid').get(controller.read);
router.param('cid',controller.menuById);
module.exports = router;
