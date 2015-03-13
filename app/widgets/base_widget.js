/**
 * Created by thanhnv on 3/9/15.
 */
var Promise = require('bluebird'),
    fs = require('fs'),
    _ = require('lodash'),
    config = require(__base + 'config/config');

var _base_config = {
    alias: "Base",
    name: "Base",
    description: "Base",
    author: "Nguyen Van Thanh",
    version: "0.1.0",
    options: {
        id: '',
        cls: '',
        title: '',
        file: ''
    }
};

//Base constructor
function BaseWidget() {
    _.assign(this, _base_config);
    this.env = __.createNewEnv();
}
BaseWidget.prototype.getAllLayouts = function (alias) {
    var files = [];
    config.getGlobbedFiles(__base + "app/themes/" + config.themes + '/_widgets/' + alias + '/*.html').forEach(function (path) {
        var s = path.split('/');
        files.push(s[s.length - 1]);
    });
    if (files.length == 0) {
        config.getGlobbedFiles(__base + "app/themes/default/_widgets/" + alias + "/*.html").forEach(function (path) {
            var s = path.split('/');
            files.push(s[s.length - 1]);
        });
    }
    return files;
}
BaseWidget.prototype.save = function (data) {
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
BaseWidget.prototype.render_setting = function (widget_type, widget) {
    var _this = this;
    return new Promise(function (done, reject) {
        _this.env.render(widget_type + '/setting.html', {widget: widget, widget_type: widget_type, files: _this.files},
            function (err, re) {
                done(re);
            }).catch(function (err) {
                reject(err);
            });
    });

}
//Render v
BaseWidget.prototype.render = function (widget, data) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var renderWidget = Promise.promisify(_this.env.render, _this.env);
        var widgetFile = widget.widget_type + '/' + widget.data.file;
        var widgetFilePath = __base + 'app/themes/' + config.themes + '/_widgets/' + widgetFile;

        if (!fs.existsSync(widgetFilePath)) {
            widgetFilePath = 'default/_widgets/' + widgetFile;
        }
        else {
            widgetFilePath = config.themes + '/_widgets/' + widgetFile;
        }

        var context = _.assign({widget: widget}, data);
        resolve(renderWidget(widgetFilePath, context).catch(function (err) {
            return "<p>" + err.cause;
        }));
    });
}

module.exports = BaseWidget;
