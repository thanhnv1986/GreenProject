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
    if (~string_to_compare.indexOf('/')) {
        string_to_compare = string_to_compare.split('/')[index];
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
        var env = new nunjucks.Environment(new nunjucks.FileSystemLoader([__base + 'app/widgets', __base + 'app/frontend/themes']));
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

exports.parseCondition = function (column_name, value, col) {
    column_name = (col.filter.model ? ('"' + col.filter.model + '".') : '') + column_name;
    if (col.filter.data_type == 'string') {
        return 'lower(' + column_name + ') like lower(?)';
    }
    else if (col.filter.data_type == 'datetime') {
        return column_name + " between ?::timestamp and ?::timestamp";
    }
    else {
        if (~value.indexOf('><') || col.filter.type == 'datetime') {
            return column_name + " between ? and ?";
        }
        else if (~value.indexOf('<>')) {
            return column_name + " not between ? and ?";
        }
        else if (~value.indexOf('>=')) {
            return column_name + " >= ?";
        }
        else if (~value.indexOf('<=')) {
            return column_name + " <= ?";
        }
        else if (~value.indexOf('<')) {
            return column_name + " < ?";
        }
        else if (~value.indexOf('>')) {
            return column_name + " > ?";
        }
        else if (~value.indexOf(';')) {
            return column_name + " in (?)";
        }
        else {
            return column_name + " = ?";
        }
    }

};
exports.parseValue = function (value, col) {
    console.log(value);
    if (col.filter.type == 'datetime') {
        return value.split(/\s+-\s+/);
    }
    //value = value.replace(/[^a-zA-Z0-9\%\?\-\/]/g, "");
    if (~value.indexOf('><')) {
        return value.split('><');
    }
    else if (~value.indexOf('<>')) {
        return value.split('<>');
    }
    else {
        return value.replace(/[^a-zA-Z0-9\%\?\-\/]/g, "");
    }

};
exports.createFilter = function (req, res, route, reset_link, current_column, order, columns, customCondition) {
    //Add button Search
    if(route!=''){
        res.locals.searchButton = __acl.customButton(route);
        res.locals.resetFilterButton = __acl.customButton(reset_link);
    }
    var conditions = [];
    var values = [];
    values.push('command');
    var getColumn = function (name) {
        for (var i in columns) {
            if (columns[i].column == name) {
                return columns[i];
            }
        }
    }
    for (var i in req.query) {
        if (req.query[i] != '') {
            var col = getColumn(i);
            if (col.query) {
                conditions.push(col.query);
            }
            else {
                conditions.push(__.parseCondition(i, req.query[i], col));
            }

            var value = __.parseValue(req.query[i], col);
            console.log(value);
            if (Array.isArray(value)) {
                for (var y in value) {
                    values.push(value[y].trim());
                }

            }
            else {
                values.push(value);
            }

        }
    }
    var tmp = conditions.length > 0 ? "(" + conditions.join(" AND ") + ")" : " 1=1 ";
    var stCondition = tmp + (customCondition ? customCondition : '');
    values[0] = stCondition;
    res.locals.table_columns = columns;
    res.locals.currentColumn = current_column;
    res.locals.currentOrder = order;
    res.locals.filters = req.query;
    return {values: values};
}

