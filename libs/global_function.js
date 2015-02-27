/**
 * Created by thanhnv on 2/26/15.
 */
var co = require('co');
exports.create_breadcrumb = function (root) {
    var arr = root.slice(0);
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] != undefined)
            arr.push(arguments[i]);
    }
    return arr;
}
exports.get_menu = function (done) {
    __models.menus.find({
        where: {
            name: "Main Menu"
        }
    }, {raw: true}).then(function (menu) {
        //console.log(menu);
        return done(null,'hello');
    });
}
