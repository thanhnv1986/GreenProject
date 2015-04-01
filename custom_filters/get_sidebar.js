'use strict'

/**
 * Created by thanhnv on 2/28/15.
 */


let Promise = require('bluebird');
let redis = require('redis').createClient();
module.exports = function (env) {
    env.addFilter('get_sidebar', function (sidebarName, route, cb) {
        let key = 'sidebar:'+__config.themes+':'+sidebarName;
        redis.get(key, function (result) {
            if (result != null) {
                cb(null, result);
            }
            else {
                let promises = [];
                __models.widgets.findAll({
                    where: {
                        sidebar: sidebarName
                    },
                    order: ['ordering']
                }, {raw: true}).then(function (widgets) {
                    for (let i in widgets) {
                        let w = __.getWidget(widgets[i].widget_type);
                        if (w) {
                            promises.push(w.render(widgets[i], route));
                        }
                    }
                    Promise.all(promises).then(function (results) {
                        let html = results.join('');
                        redis.setex(key, 600, html);
                        cb(null, html);
                    });
                });
            }
        });
    }, true);
};
