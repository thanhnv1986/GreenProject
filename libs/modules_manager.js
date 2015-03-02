/**
 * Created by thanhnv on 2/23/15.
 */
var config = require('../config/config');
var redis = require('redis').createClient();
var modules = {};
module.exports = function () {
    return modules;
};
exports.loadAllModule = function(override){
    if(override){
        redis.delete('all_modules');
    }
    // Globbing admin module files
    redis.get('all_modules', function (err, results) {
        if (results != null) {
            global.__modules = JSON.parse(results);
        }
        else {
            config.getGlobbedFiles('../app/backend/*/module.js').forEach(function (routePath) {
                console.log(path.resolve(routePath));
                require(path.resolve(routePath))(__modules);
            });
            redis.set('all_modules', JSON.stringify(__modules), redis.print);
        }
    });
}
exports.addModule = function (name, module) {
    if (!module.active) {
        module.active = false;
    }
    modules[name] = module;
};
exports.removeModule = function (name) {
    delete modules[name];
};
exports.enableModule = function (name) {
    modules[name].active = true;
};
exports.disableModule = function (name) {
    modules[name].active = false;
};
