'use strict'

/**
 * Created by thanhnv on 2/28/15.
 */


var Promise = require('bluebird');
var redis = require('redis').createClient;
module.exports = function (env) {
    env.addFilter('get_sidebar', function (sidebarName, route, cb) {
        return cb(null, '');
        var key = 'sidebar:'+__config.themes+':'+sidebarName;
        /*redis.get(key, function (result) {
            if (result != null) {
                cb(null, result);
            }
            else {*/
                var promises = [];
                __models.widgets.findAll({
                    where: {
                        sidebar: sidebarName
                    },
                    order: ['ordering']
                }, {raw: true}).then(function (widgets) {
                    for (var i in widgets) {
                        var w = __.getWidget(widgets[i].widget_type);
                        if (w) {
                            promises.push(w.render(widgets[i], route));
                        }
                    }
                    Promise.all(promises).then(function (results) {
                        var html = results.join('');
                        //redis.setex(key, 60, html);
                        cb(null, html);
                    });
                });
       /*     }
        });*/
    }, true);
};
