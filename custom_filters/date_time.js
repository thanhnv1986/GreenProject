/**
 * Created by thanhnv on 2/28/15.
 */
var config = require(__base + 'config/config');
module.exports = function (env) {
    env.addFilter('date_time', function (input) {
        var func = env.getFilter('date');
        return func(input, config.date_format);
    });
}
