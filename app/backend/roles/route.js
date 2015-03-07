/**
 * Created by thanhnv on 1/26/15.
 */
var express = require('express');
var router = express.Router();
var controller = require('./controllers/index.js');
var moduleName = 'roles';

router.get('/roles', __acl.isAllow(moduleName, 'index'), controller.list);
router.delete('/roles', __acl.isAllow(moduleName, 'delete'), controller.delete);
router.get('/roles/create', __acl.isAllow(moduleName, 'create'), controller.create);
router.post('/roles/create', __acl.isAllow(moduleName, 'create'), controller.save, controller.list);
router.get('/roles/:cid', __acl.isAllow(moduleName, 'update'), controller.view);
router.post('/roles/:cid', __acl.isAllow(moduleName, 'update'), controller.update, controller.list);

module.exports = router;
