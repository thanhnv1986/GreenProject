/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('check_state', function (rules, moduleName, action) {
        for (var i in rules) {
            if (i == moduleName) {
                if (rules[i].indexOf(action) > -1) {
                    return 'checked';
                }
            }
        }
        return '';
    });
}
