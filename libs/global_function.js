/**
 * Created by thanhnv on 2/26/15.
 */
var config = require(__base + 'config/config');

exports.create_breadcrumb = function (root) {
    var arr = root.slice(0);
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] != undefined)
            arr.push(arguments[i]);
    }
    return arr;
};
exports.active_menu = function (value, string_to_compare, cls, index) {
    var arr = value.split('/');
    var st = "active";
    if (cls) {
        st = cls;
    }
    if (index) {
        return arr[index] === string_to_compare ? st : "";
    }
    return arr[2] == string_to_compare ? st : "";
};

exports.sortMenus = function (menus) {
    var sortable = [];
    for (var m in menus) {
        //console.log(menus[m].sort);
        sortable.push({menu: m, sort: menus[m].sort})
    }
    sortable.sort(function (a, b) {
        if (a.sort < b.sort)
            return -1;
        if (a.sort > b.sort)
            return 1;
        return 0;
    });
    return sortable;
};
exports.getWidget = function (alias) {
    for (var i in __widgets) {
        if (__widgets[i].alias == alias) {
            return __widgets[i];
        }
    }
};
exports.createNewEnv = function (views) {
    var nunjucks = require('nunjucks');
    if (views) {
        var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(views));
    }
    else {
        var env = new nunjucks.Environment(new nunjucks.FileSystemLoader([__base + 'app/widgets', __base + 'app/themes']));
    }
    env = __.getAllCustomFilter(env);
    return env;
};
exports.getAllCustomFilter = function (env) {
    config.getGlobbedFiles(__base + 'custom_filters/*.js').forEach(function (routePath) {
        console.log(routePath);
        require(routePath)(env);
    });
    return env;
};

exports.parseCondition = function (column, value) {
    var st = "";
    if (~value.indexOf('%')) {
        return column + " like ?";
    }
    else if (~value.indexOf('>')) {
        return column + " > ?";
    }
    else if (~value.indexOf('>=')) {
        return column + " >= ?";
    }
    else if (~value.indexOf('<')) {
        return column + " < ?";
    }
    else if (~value.indexOf('<=')) {
        return column + " <= ?";
    }
    else if (~value.indexOf('-')) {
        return column + " between ? and ?";
    }
    else if (~value.indexOf(';')) {
        return column + " in (?)";
    }
    else {
        return column + " = ?";
    }
};
exports.parseValue = function (value) {
    value = value.replace(/[^a-zA-Z0-9\%\?-]/g, "");
    if (~value.indexOf('-')) {
        return value.split('-');
    }
    else {
        return value;
    }

};

