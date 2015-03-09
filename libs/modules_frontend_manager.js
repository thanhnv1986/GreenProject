/**
 * Created by thanhnv on 2/23/15.
 */
var config = require('../config/config');
var redis = require('redis').createClient();
var path = require('path');
var modules = {};
module.exports = function () {
    return modules;
};
module.exports.loadAllModules = function () {

    // Globbing admin module files
    var module_tmp = {};
    config.getGlobbedFiles(__base + 'app/frontend/*/module.js').forEach(function (routePath) {
        console.log(path.resolve(routePath));
        require(path.resolve(routePath))(module_tmp);
    });
    //add new module
    for (var i in module_tmp) {
        if (__f_modules[i] == undefined) {
            __f_modules[i] = module_tmp[i];
        }
        else {
            __f_modules[i] = _.assign(__f_modules[i], module_tmp[i]);
        }

    }
    //remove module
    for (var i in __f_modules) {
        if (module_tmp[i] == undefined) {
            delete __f_modules[i];
        }
    }
    redis.set('all_fmodules', JSON.stringify(__f_modules), redis.print);
}

