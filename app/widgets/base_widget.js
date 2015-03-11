/**
 * Created by thanhnv on 3/9/15.
 */
var Promise = require('bluebird'),
    fs = require('fs'),
    _ = require('lodash'),
    config = require(__base + 'config/config');

//Base constructor
function BaseWidget() {
    this.env = __.createNewEnv();
}
var widget = BaseWidget;
widget.prototype.save = function (data) {
    return new Promise(function (done, reject) {
        var json_data = _.clone(data);
        delete json_data.sidebar;
        delete json_data.id;
        json_data = JSON.stringify(json_data);
        if (data.id != '') {
            __models.widgets.find(data.id).then(function (widget) {
                widget.updateAttributes({
                    sidebar: data.sidebar,
                    data: json_data
                }).then(function (widget) {
                    done(widget.id);
                });
            });

        } else {
            __models.widgets.create({
                id: new Date().getTime(),
                widget_type: data.widget,
                sidebar: data.sidebar,
                data: json_data,
                ordering: data.ordering
            }).then(function (widget) {
                done(widget.id);
            });
        }

    });
}
widget.prototype.render_setting = function (widget_type, widget) {
    var _this = this;
    return new Promise(function (done, reject) {
        _this.env.render(widget_type + '/setting.html', {widget: widget},
            function (err, re) {
                done(re);
            });
    });

}
widget.prototype.render = function (widget, data) {
    return new Promise(function (resolve, reject) {
        var env, renderWidget;
        var widgetFile = widget.widget_type + '/view.html';
        var widgetFilePath = __base + 'app/themes/' + config.themes + '/_widgets/' + widgetFile;
        console.log('Widget Path : ', widgetFilePath);
        if (!fs.existsSync(widgetFilePath)) {
            widgetFilePath = widgetFile;
            env = __.createNewEnv();
            renderWidget = Promise.promisify(env.render, env);
        }
        else {
            env = __.createNewEnv([__base + 'app/themes']);
            renderWidget = Promise.promisify(env.render, env);

            widgetFilePath = config.themes + '/_widgets/' + widgetFile;
        }
        console.log("User view: ", widgetFilePath);
        var context = _.assign({widget: widget}, data);
        resolve(renderWidget(widgetFilePath, context).catch(function (err) {
            return "<p>" + err.cause;
        }));
    });
}

module.exports = widget;
