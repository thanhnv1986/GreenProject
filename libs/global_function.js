/**
 * Created by thanhnv on 2/26/15.
 */
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
}

