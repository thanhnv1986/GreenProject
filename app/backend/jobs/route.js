/**
 * Created by vhchung on 1/26/15.
 */
var express = require('express');
var router = express.Router(),
    chalk = require('chalk');


var jobs = require('./controllers/index');

var moduleName = 'jobs';
router.route('/jobs/create').get(__acl.isAllow(moduleName, 'create'), jobs.create);
router.route('/jobs/create').post(__acl.isAllow(moduleName, 'create'), jobs.save, jobs.list);
//jobs Routes
router.route('/jobs').delete(__acl.isAllow(moduleName, 'delete'), jobs.delete);
router.route('/jobs').get(__acl.isAllow(moduleName, 'index'), jobs.list);
router.route('/jobs/page/:page').get(__acl.isAllow(moduleName, 'index'), jobs.list);

router.route('/jobs/:jobId').get(__acl.isAllow(moduleName, 'update'), jobs.jobByID);
router.route('/jobs/:jobId').put(__acl.isAllow(moduleName, 'update'), jobs.update);

module.exports = router;

