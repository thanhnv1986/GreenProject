/**
 * Created by thanhnv on 2/28/15.
 */
var config = require(__base+'config/config.js');
module.exports = function (env) {
    env.addFilter('get_theme', function (name) {
        return config.themes+"/"+name;
    });
}
