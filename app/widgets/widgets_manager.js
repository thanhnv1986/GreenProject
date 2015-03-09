/**
 * Created by thanhnv on 3/5/15.
 */
var config = require(__base + 'config/config');
module.exports = function () {
    var w = [];
    config.getGlobbedFiles(__base + "app/widgets/*/*.js").forEach(function (routePath) {
        var Widget = require(routePath);
        w.push(new Widget());
    });
    return w;
}
