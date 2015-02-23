/**
 * Created by thanhnv on 2/23/15.
 */
var modules = {};
module.exports = function () {
    return modules;
};

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
