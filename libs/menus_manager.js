/**
 * Created by thanhnv on 2/23/15.
 */
var menus = {};
module.exports = function () {
    return menus;
};

exports.addMenu = function (name, menu) {
    if (!menu.active) {
        menu.active = false;
    }
    menus[name] = menu;
};
exports.removeMenu = function (name) {
    delete menus[name];
};
exports.enableMenu = function (name) {
    menus[name].active = true;
};
exports.disableMenu = function (name) {
    menus[name].active = false;
};
