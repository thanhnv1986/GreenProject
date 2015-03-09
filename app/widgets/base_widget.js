/**
 * Created by thanhnv on 3/9/15.
 */
var Promise = require('bluebird'),
    fs = require('fs'),
    config = require(__base + 'config/config');

//Base constructor

function BaseWidget() {

}
var widget = BaseWidget;
widget.prototype._render = function (widget) {
    return new Promise(function (resolve, reject) {
        var env = __.createNewEnv();
        var renderWidget = Promise.promisify(env.render, env);
        var widgetFile = widget.widget_type + '/view.html';
        var widgetFilePath = __base + 'app/themes/' + config.themes + '/_widgets/' + widgetFile;
        if (!fs.existsSync(widgetFilePath + '.html')) {
            widgetFilePath = widgetFile;
        }
        resolve(renderWidget(widgetFilePath, {widget: widget}));
    });
}

module.exports = widget;
