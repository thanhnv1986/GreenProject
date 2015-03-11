/**
 * Created by thanhnv on 2/28/15.
 */
var Promise = require('bluebird');

module.exports = function (env) {
    env.addFilter('setting_sidebars', function (sidebarName, cb) {
        __models.widgets.findAll({
            where: {
                sidebar: sidebarName
            },
            order:['ordering']
        }, {raw: true}).then(function (widgets) {
            var promises = [];
            var getWidgetHtml = function (widget) {
                var w = __.getWidget(widget.widget_type);
                promises.push(w.render_setting(widget.widget_type, widget));
            }
            for (var i in widgets) {
                getWidgetHtml(widgets[i]);
            }
            Promise.all(promises).then(function (results) {
                var html = "";
                if (results.length > 0) {
                    for (var i in results) {
                        var w = __.getWidget(widgets[i].widget_type);
                        html += '<li style="position: relative" id="' + widgets[i].id + '">' +
                        '<div class="widget-item" style="position: relative">' + w.name + '</div>' +
                        '<a href="#" class="fa fa-caret-left expand_arrow" onclick="return showDetail(this);"></a>' +
                        '<div class="box box-solid close"><div class="box-body">' + results[i] + '</div></div></li>';
                    }
                }

                cb(null, html);
            });
        });
    }, true);
}
