"use strict"
/**
 * Created by thanhnv on 2/28/15.
 */
let Promise = require('bluebird');

module.exports = function (env) {
    env.addFilter('setting_sidebars', function (sidebarName, cb) {
        __models.widgets.findAll({
            where: {
                sidebar: sidebarName
            },
            order: ['ordering']
        }, {raw: true}).then(function (widgets) {
            let promises = [];
            let getWidgetHtml = function (widget) {
                let w = __.getWidget(widget.widget_type);
                if (w) {
                    promises.push(w.render_setting(widget.widget_type, widget));
                }

            }
            for (let i in widgets) {
                getWidgetHtml(widgets[i]);
            }
            Promise.all(promises).then(function (results) {
                let html = "";
                if (results.length > 0) {
                    for (let i in results) {
                        let w = __.getWidget(widgets[i].widget_type);
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
