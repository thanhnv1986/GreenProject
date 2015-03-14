/**
 * Created by thanhnv on 3/13/15.
 */
var Promise = require('bluebird');

function EventManager() {
    this.fire_event = function (name, data, cb) {
        var promises = [];
        var promisesSync = [];
        var allPromise = [];
        var syncData;
        //Check plugin will run with event
        for (var i in __pluginManager.plugins) {
            var plugin = __pluginManager.plugins[i];
            var active = plugin.active;
            if (active) {
                if (plugin[name]) {
                    //check plugin run with sync data
                    if (plugin.sync) {
                        promisesSync.push(plugin[name]);
                    }
                    else {
                        promises.push(plugin[name](data));
                    }

                }
            }
        }
        if (promisesSync.length > 0) {
            syncData = data;
            allPromise.push(new Promise(function (done, reject) {
                Promise.each(promisesSync, function (task) {
                    task(syncData).then(function (result) {
                        syncData = result;
                    });
                }).finally(function () {
                    done(syncData);
                });
            }));
        }
        if (promises.length > 0) {
            allPromise.push(Promise.settle(promises).then(function (results) {
                var values = [];
                var errors = [];
                results.forEach(function (result) {
                    if (result.isFulfilled()) {
                        values.push(result.value());
                    }
                    else {
                        errors.push(result.reason());
                    }
                });
                return values;
            }));
        }
        if (allPromise.length > 0) {
            Promise.all(allPromise).then(function (results) {
                cb(null, results.join(''));
            });
        }
        else {
            cb(null, '');
        }

    };
}
module.exports = new EventManager();
