/**
 * Created by thanhnv on 2/28/15.
 */
var Promise = require('bluebird');

module.exports = function (env) {
    env.addFilter('get_sidebar', function (sidebarName, route, cb) {
        var html = '';
        var promises = [];
        __models.widgets.findAll({
            where: {
                sidebar: sidebarName
            },
            order: ['ordering']
        }, {raw: true}).then(function (widgets) {
            for (var i in widgets) {
                var w = __.getWidget(widgets[i].widget_type);
                promises.push(w.render(widgets[i], route));
            }
            Promise.all(promises).then(function (results) {
                cb(null, results.join(''));
            });
        });
        return html;
    }, true);
}
