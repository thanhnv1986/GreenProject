/**
 * Created by thanhnv on 3/13/15.
 */
var Promise = require('bluebird');

function EventManager() {
    this.fire_event = function (name, data, cb) {
        var promises = [];
        for (var i in __pluginManager.plugins) {
            var plugin = __pluginManager.plugins[i];
            var active = plugin.active;
            if (active) {
                if (plugin[name]) {
                    promises.push(plugin[name](data));
                }
            }
        }
        if (promises.length > 0) {
            Promise.all(promises).then(function (results) {
                cb(null, results.join(''));
            });
        }
        else {
            cb(null, '');
        }
    };
}
module.exports = new EventManager();
