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
}
exports.get_menu = function (menu_name) {
    console.log("****");
    return "123";
}
