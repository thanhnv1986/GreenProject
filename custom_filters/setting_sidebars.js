/**
 * Created by thanhnv on 2/28/15.
 */
var Promise = require('bluebird');

module.exports = function (env) {
    env.addFilter('setting_sidebars', function (sidebarName, cb) {
        __models.widgets.findAll({
            where: {
                sidebar: sidebarName
            }
        }, {raw: true}).then(function (widgets) {
            var promises = [];
            var getWidgetHtml = function (widget) {
                var nunjucks = require('nunjucks');
                var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__base + 'app/widgets'));
                var renderWidget = Promise.promisifyAll(env);
                promises.push(renderWidget.renderAsync(widget.widget_type + '/setting.html', {widget: widget}));

            }
            for (var i in widgets) {
                getWidgetHtml(widgets[i]);
            }
            Promise.all(promises).then(function (results) {
                var html = "";
                for (var i in results) {
                    var w = __.getWidget(widgets[i].widget_type);
                    html += '<li style="position: relative">' +
                        '<div class="widget-item" style="position: relative">' + w.name + '</div>' +
                        '<a href="#" class="fa fa-caret-left expand_arrow" onclick="return showDetail(this);"></a>' +
                        '<div class="box box-solid close"><div class="box-body">' + results[i] + '</div></div></li>';
                }
                cb(null, html);
            });
        });
    }, true);
}
