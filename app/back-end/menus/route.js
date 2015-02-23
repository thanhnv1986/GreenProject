/**
 * Created by thanhnv on 2/17/15.
 */

var express = require('express');
var router = express.Router();
var controller = require('./controllers/index.js');

//Books Routes

router.route('/menus').get(controller.index);

module.exports = router;
