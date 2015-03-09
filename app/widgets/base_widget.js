/**
 * Created by thanhnv on 3/9/15.
 */
var Promise = require('bluebird'),
    fs = require('fs'),
    _ = require('lodash'),
    config = require(__base + 'config/config');

//Base constructor

function BaseWidget() {

}
var widget = BaseWidget;
widget.prototype.save = function(data, done){
    console.log("Widget save");
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
            widget_type: this.alias,
            sidebar: data.sidebar,
            data: json_data
        }).then(function (widget) {
            done(widget.id);
        });
    }
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
        resolve(renderWidget(widgetFilePath, context));
    });
}

module.exports = widget;
