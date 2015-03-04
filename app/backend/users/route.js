/**
 * Created by thanhnv on 1/26/15.
 */
var express = require('express');
var router = express.Router();
var controller = require('./controllers/index.js');
var moduleName = 'users';

router.get('/users/signout',controller.signout);
router.get('/users/change-pass',controller.changePass);
router.post('/users/change-pass',controller.updatePass);
router.get('/users/profile',controller.profile);

router.get('/users', __acl.isAllow(moduleName, 'index'), controller.list);
router.get('/users/page/:page', __acl.isAllow(moduleName, 'index'), controller.list);

router.delete('/users', __acl.isAllow(moduleName, 'delete'), controller.delete);
router.get('/users/create', __acl.isAllow(moduleName, 'create'), controller.create);
router.post('/users/create', __acl.isAllow(moduleName, 'create'), controller.save, controller.list);
router.get('/users/:cid', __acl.isAllow(moduleName, 'update'), controller.view);
router.post('/users/:cid', __acl.isAllow(moduleName, 'update'), controller.update, controller.list);

router.param('cid',controller.userById);

module.exports = router;
