/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('even', function (value) {
        return parseFloat(value) % 2 == 0;
    });
}
