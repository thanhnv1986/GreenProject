/**
 * Created by thanhnv on 2/23/15.
 */
var config = require('../config/config');
var redis = require('redis').createClient();
var path = require('path');
var _ = require('lodash');
var modules = {};
module.exports = function () {
    return modules;
};
module.exports.loadAllModules = function () {

    // Globbing admin module files
    var module_tmp = {};
    config.getGlobbedFiles(__base + 'app/backend/*/module.js').forEach(function (routePath) {
        console.log(path.resolve(routePath));
        require(path.resolve(routePath))(module_tmp);
    });
    //add new module
    for (var i in module_tmp) {
        if (__modules[i] == undefined) {
            __modules[i] = module_tmp[i];
        }
        else {
            _.assign(module_tmp[i], __modules[i]);
            __modules[i] = module_tmp[i];
        }
    }
    //remove module
    for (var i in __modules) {
        if (module_tmp[i] == undefined) {
            delete __modules[i];
        }
    }
    redis.set('all_modules', JSON.stringify(__modules), redis.print);
}
